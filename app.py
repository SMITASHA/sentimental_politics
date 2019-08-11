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
engine = create_engine("sqlite:///politics_db.db", connect_args={'check_same_thread': False}, echo=True)

# Reflect database and tables into new models
Base = automap_base()
Base.prepare(engine, reflect=True)
Candidates = Base.classes.candidates
Twitter = Base.classes.twitter

# Create our session from Python to the DB
session = Session(bind=engine)

#### OR DO WE DO THIS????####
# Database Setup
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///cancer.sqlite"
# db = SQLAlchemy(app)

# Reflect an existing database and tables
# Base = automap_base()
# Base.prepare(db.engine, reflect=True)
#########

# Flask Setup
app = Flask(__name__)

# Define Flask Routes
@app.route("/")
def index():
    """Render the homepage."""
    

    return render_template("index.html")


@app.route("/candidate/<candidate>")
def candidate(candidate):
    """Do something"""


    # Get sentiment data 
    results = session.query(Twitter.tweet_date, Twitter.sentiment, func.count(Twitter.id).label("tweet_count"))\
        .group_by(Twitter.tweet_date)\
        .group_by(Twitter.sentiment)\
        .filter(Twitter.username == candidate)\
        .all()
    
    # Convert query result into list of dictionaries
    tweet_list = []

    for result in results:
        if result.sentiment:
            sentiment = "Positive"
        else:
            sentiment = "Negative"
        tweet_dict = {"date": result.tweet_date, "sentiment": sentiment, "tweet_count": result.tweet_count}
        tweet_list.append(tweet_dict)
    
    # NOTE: WE ARE RETURNING A DIFFERENT TYPE OF DICTIONARY. WILL NEED TO TAKE THIS INTO ACCOUNT ON JS END
    return jsonify(tweet_list)



    
    """For line chart:

    Using sqalchemy:
    Group tweets by day
    Group tweets by sentiment
    Count number of tweets per sentiment per day
    return list of dictionaries: [{"date": tweet_date, "negative": neg_tweet_no, "postive": pos_tweet_no}]

    For pie chart:
    Use same route and do math in javascript"""


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
