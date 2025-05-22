from flask import Blueprint, request, jsonify
import subprocess
import time
import threading
import queue
import os
from datetime import datetime
import yaml
from pathlib import Path

script_dir = Path(__file__).parent

wrapper = Blueprint('wrapper',__name__)


# helper function for pgbench stream
def stream_subprocess_output(cmd,env=None):
    def stream(pipe, source, output):
        for line in iter(pipe.readline, ''):
            output.append((source, line.rstrip('\n')))
        pipe.close()

    # Prepare environment
    process_env = os.environ.copy()
    if env:
        process_env.update(env)      

    with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1,env=process_env) as proc:
        output = []
        threads = [
            threading.Thread(target=stream, args=(proc.stdout, 'stdout', output)),
            threading.Thread(target=stream, args=(proc.stderr, 'stderr', output)),
        ]
        for t in threads:
            t.start()
        while any(t.is_alive() for t in threads) or output:
            while output:
                yield output.pop(0)
        for t in threads:
            t.join()

def invoke_certify(raw_config:str,snapClass:str,kubeconfig_location:dict):
    # convert raw_config to yaml
    config = yaml.safe_load(raw_config)
    # write out to a local file
    output_path = script_dir / 'output.yaml'
    with open(output_path, 'w') as file:
        yaml.dump(config, file, sort_keys=False)
        file.flush()
    # now invoke the command
    command = f'/workspaces/cert-csi-ux/app/cert-csi certify --cert-config {output_path} --vsc {snapClass}' #TODO update path
    cmd = command.split(' ')

    lines = []
    # invoke
    print("starting...")
    # execute the command and wait
    start_time = time.perf_counter()
    end_time = 0
    for source, line in stream_subprocess_output(cmd,kubeconfig_location):
        lines.append(line) #just collect the outputs
    end_time = time.perf_counter()

    elapsed_time = end_time - start_time

    print(f"finished {elapsed_time}")
    # result
    result = {
        "result":lines,
        "timeTaken":elapsed_time,
        "timestamp":datetime.now().isoformat()
    }
    return result


def invoke_with_prompt(raw_config:str,snapClass:str,env:dict):
    # convert raw_config to yaml
    config = yaml.safe_load(raw_config)
    # # write out to a local file
    output_path = script_dir / 'output.yaml'
    with open(output_path, 'w') as file:
        yaml.dump(config, file, sort_keys=False)
        file.flush()
    # # now invoke the command
    command = f'/app/cert-csi certify --cert-config {output_path} --vsc {snapClass}' #TODO update path    
    cmd = command.split(' ')

    # Prepare environment
    process_env = os.environ.copy()
    if env:
        process_env.update(env)      

    start_time = time.perf_counter()
    end_time = 0

    lines = []

    proc = subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=process_env
    )
    
    try:
        # Read output until a prompt is detected (customize as needed)
        # Here, we read a line and print it; you may want to implement
        # more sophisticated prompt detection
        output = proc.stdout.readline()
        lines.append(output)
        # print(output, end='')  # Show the prompt
        
        # Send 'y' followed by newline to the process
        proc.stdin.write('y\n')
        proc.stdin.flush()
        
        # Read remaining output
        remaining_output, error = proc.communicate()
        # print(remaining_output, end='')
        lines.append(remaining_output)
        if error:
            lines = [error] # reset
            # print("Error:", error)
    except Exception as e:
        print("Exception:", e)
    finally:
        proc.stdin.close()
        proc.stdout.close()
        proc.stderr.close()

    end_time = time.perf_counter()

    elapsed_time = end_time - start_time

    print(f"finished {elapsed_time}")

    result = {
        "result":lines,
        "timeTaken":elapsed_time,
        "timestamp":datetime.now().isoformat()
    }
    return result


def save_k8s_config(k8s_config:str):
    # write it out as a file
    # return the location to be passed as an ENV variable
    # convert raw_config to yaml
    config = yaml.safe_load(k8s_config)
    # write out to a local file
    output_path = script_dir / 'kubeconfig'
    with open(output_path, 'w') as file:
        yaml.dump(config, file, sort_keys=False)
        file.flush()
    # return
    return output_path


@wrapper.route('/api/certify', methods=['POST'])
def upload_yaml():
    form_data = request.form.to_dict()
    # get the kubernetes config
    kube_config = form_data.get('k8s_config')
    # get the snapshot
    snapshot_class = form_data.get('snapClass')
    # get the yaml filed
    raw_config = form_data.get('config_yaml')
    # write the kubernetes location
    k8s_location = save_k8s_config(kube_config)
    env = {
        'KUBECONFIG':k8s_location
    }

    # run the config
    result = invoke_with_prompt(raw_config,snapshot_class,env)
    # return
    return jsonify(result,200)