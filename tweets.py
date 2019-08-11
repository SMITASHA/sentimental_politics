# Import dependencies
import tweepy
import pandas as pd
import os
from os import path
import pathlib
from api_keys import API_key, secret_key, access_token, secret_token

# Set authorization for querying twitter API using tweepy
auth = tweepy.OAuthHandler(API_key, secret_key)
auth.set_access_token(access_token, secret_token)
api = tweepy.API(auth, wait_on_rate_limit=True)

def get_tweets(screen_name, since_id):
    """Queries API for tweets based on given search and date parameters.
    Returns list of search result objects"""

    print(f"Querying tweets for {screen_name}...")

    # Select candidate and search date
    query = screen_name +" -filter:retweets"
    tweets = tweepy.Cursor(api.search,\
        q = query,\
        lang = "en",\
        since_id = since_id,\
        tweet_mode='extended').items(1000)
    
    return tweets


def convert_tweets(tweets):
    """Extracts desired tweet attributes into returned dataframe"""


    tweet_list = []
    for tweet in tweets:
        tweet_dict = {"twitter_id": tweet.id_str,\
            "tweet_date": tweet.created_at,\
            "tweet": tweet.full_text,\
            "retweet": tweet.retweet_count,\
            "favorite": tweet.favorite_count}
        tweet_list.append(tweet_dict)
        
    tweet_df = pd.DataFrame(tweet_list)
    
    return(tweet_df)


def main():
    """Saves tweets about candidates until given data into csvs"""
    
    
    # Create list of candidate usernames
    usernames = ["@JoeBiden", "@BernieSanders", "@ewarren", "@KamalaHarris"]

    for username in usernames:

        # Check to see if tweets have already been queried and saved
        file = pathlib.Path(f"data/{username}.csv")
        if file.exists ():

            # Convert tweets to dataframe and set last tweet id
            tweet_df = pd.read_csv(file)
            since_id = tweet_df["twitter_id"].max()
        
        # If no saved tweets, create empty dataframe and initialize tweet id
        else:
            since_id = 0
            tweet_df = pd.DataFrame(columns=["twitter_id", "tweet_date", "tweet", "retweet", "favorite"])
        
            # Get tweets and convert to dataframe
        tweets = get_tweets(username, since_id)
        new_df = convert_tweets(tweets)

        # Append new tweets to old and save to csv
        tweet_df = tweet_df.append(new_df, ignore_index=True, sort=True)
        tweet_df.to_csv(file, index=False, header= True)
        print(f"Saved tweets to csv for {username}.")


main()
