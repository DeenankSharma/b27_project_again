 # please follow mvc architecture in backend
from flask import Flask
app = Flask(__name__)
@app.route('/')
def foo():
    return 'la la la'
if __name__ == '__main__':
    app.run()