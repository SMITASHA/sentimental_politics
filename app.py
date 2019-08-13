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

    """
    FIGURE OUT WORD CLOUD!!!
    For word cloud:

    If we do d3, we need to do this complicated stuff. Might be worthwhile to do another way

    We can use sparse matrix from model to do this. This is very confusing!!!


    neg_doc_matrix = cvec.transform(my_df[my_df.target == 0].text)
    pos_doc_matrix = cvec.transform(my_df[my_df.target == 1].text)
    neg_tf = np.sum(neg_doc_matrix,axis=0)
    pos_tf = np.sum(pos_doc_matrix,axis=0)
    neg = np.squeeze(np.asarray(neg_tf))
    pos = np.squeeze(np.asarray(pos_tf))
    term_freq_df = pd.DataFrame([neg,pos],columns=cvec.get_feature_names()).transpose()

    get all tweets form database for parameter candidate
    get rid of stop words
    get rid of small words
        words = no_special_characters.split(" ")
        words = [w for w in words if len(w) > 2]  # ignore a, an, be, ...
        words = [w.lower() for w in words]
        words = [w for w in words if w not in STOPWORDS]

        filtered_words = [word for word in all_headlines.split() if word not in stopwords]
        counted_words = collections.Counter(filtered_words)

        words = []
        counts = []
        for letter, count in counted_words.most_common(10):
            words.append(letter)
            counts.append(count)"""


if __name__ == "__main__":
    # TODO: Remeber to turn debugging off when going live! 
    app.run(debug=True, port=8000, host="localhost", threaded=True)
