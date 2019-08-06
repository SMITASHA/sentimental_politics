# Import dependencies
import csv
import os
import pandas as pd
import random
import numpy as np
from flask import (
    Flask,
    render_template,
    jsonify)
from joblib import load

# Sqlite 
import sqlite3
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func


#Set up Flask
app = Flask(__name__)

###################################################################
# GRETEL- NOT SURE WHICH WAY TO GO WITH THE DATABASE STUFF

# Create database
# conn = sqlite3.connect("tweets.db")

# Database Setup
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sentiment.sqlite"
# db = SQLAlchemy(app)

# Reflect an existing database and tables
# Base = automap_base()
# Base.prepare(db.engine, reflect=True)
###################################################################
@app.route("/")
def index():
    """Render the homepage."""
    

    return render_template("index.html")


@app.route("/candidate/<CANDIDATE>")
def candidate():
    """Do something"""
    
    return something



if __name__ == "__main__":
    # TODO: Remeber to turn debugging off when going live! 
    app.run(debug=True, port=8000, host="localhost", threaded=True)
