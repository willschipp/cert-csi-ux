from flask import Flask, send_from_directory
import os

from server.wrapper import wrapper as wrapper_blueprint

app = Flask(__name__,static_folder='frontend/dist')
app.register_blueprint(wrapper_blueprint)

@app.route("/",defaults={"path":""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

def main():
    app.run(
        host="0.0.0.0",
        port=5000,
        threaded=True,
    )

if __name__ == "__main__":
    main()