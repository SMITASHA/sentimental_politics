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
import nltk
from nltk.corpus import stopwords

# Sqlite 
import sqlite3
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

# Connect to database
engine = create_engine("sqlite:///politics.sqlite", connect_args={'check_same_thread': False}, echo=True)

# Reflect database and tables into new models
Base = automap_base()
Base.prepare(engine, reflect=True)
Candidates = Base.classes.candidates
Twitter = Base.classes.twitter

# Create our session from Python to the DB
session = Session(bind=engine)

# Flask Setup
app = Flask(__name__)

# Define Flask Routes
@app.route("/")
def index():
    """Render the homepage."""
    

    return render_template("index.html")


@app.route("/tweets")
def tweets():
    """Returns list of dates and the maximum number of tweets"""
    

    # Get sentiment data 
    results = session.query(Twitter.tweet_date, Twitter.username, \
        Twitter.sentiment, func.count(Twitter.id).label("tweet_count"))\
        .group_by(Twitter.tweet_date)\
        .group_by(Twitter.username)\
        .group_by(Twitter.sentiment)\
        .all()
    
    # Convert query result into 2 lists of dictionaries: one for positive, one for negative
    dates = []
    max_count = 0
    for result in results:
        if result.tweet_date not in dates:
            dates.append(result.tweet_date)
        if max_count < result.tweet_count:
            max_count = result.tweet_count
    
    tweet_list = []
    for date in dates:
        tweet_dict = {"date": date, "max_tweets": max_count}
        tweet_list.append(tweet_dict)

    # Returned dataframe as json object
    return jsonify(tweet_list)


@app.route("/candidate/<candidate>")
def candidate(candidate):
    """Returns a list of dictionaries with date and number of 
    positive and negative tweets for each day"""


    # Get sentiment data 
    results = session.query(Twitter.tweet_date, Twitter.sentiment, func.count(Twitter.id).label("tweet_count"))\
        .group_by(Twitter.tweet_date)\
        .group_by(Twitter.sentiment)\
        .filter(Twitter.username == candidate)\
        .all()
    
    # Convert query result into 2 lists of dictionaries: one for positive, one for negative
    positive_tweets = []
    negative_tweets = []
    for result in results:
        if result.sentiment:
            positive_count = result.tweet_count
            tweet_dict = {"date": result.tweet_date, "positive_count": positive_count}
            positive_tweets.append(tweet_dict)
        else:
            negative_count = result.tweet_count
            tweet_dict = {"date": result.tweet_date, "negative_count": negative_count}
            negative_tweets.append(tweet_dict)
        
    # Convert lists to dataframe and merge on date
    positive_df = pd.DataFrame(positive_tweets)
    negative_df = pd.DataFrame(negative_tweets)
    twitter_df = pd.merge(positive_df, negative_df, on = "date")

    # Returned dataframe as json object
    return twitter_df.to_json(orient = "records")


@app.route("/cloud/<candidate>")
def cloud(candidate):
    """Json of top 50 words and their frequency"""


    twitter_df = pd.read_csv(f"data/{candidate}_freq.csv")
    return twitter_df.to_json(orient = "records")



if __name__ == "__main__":
    # TODO: Remeber to turn debugging off when going live! 
    app.run(debug=True, port=8000, host="localhost", threaded=True)
