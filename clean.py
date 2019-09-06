# Import Dependencies
import re


def replace_emoticons(tweet):
    """Replace emoticons with positive or negative words"""

    
    # Define emoticons to be replaced
    emoticon_pos = [':-)', ':)', ';)', ':o)', ':]', ':3', ':c)', ':>', '=]', '8)', '=)',\
                    ':}', ':^)', ':-D', ':D', '8-D', '8D', 'x-D', 'xD', 'X-D', 'XD',\
                    '=-D', '=D', '=-3', '=3', ':-))', ":'-)", ":')", ':*', ':^*', '>:P',\
                    ':-P',':P', 'X-P','x-p', 'xp', 'XP', ':-p', ':p', '=p', ':-b', ':b',\
                    '>:)','>;)', '>:-)', '<3']
    emoticon_neg = [':L', ':-/', '>:/', ':S', '>:[', ':@', ':-(', ':[', ':-||', '=L',\
                    ':<',':-[', ':-<', '=\\', '=/', '>:(', ':(', '>.<', ":'-(", ":'(",\
                    ':\\', ':-c',':c', ':{', '>:\\', ';(']
    
    # If a word in a tweet is an emoticon, replace that emoticon good/bad
    for emoticon in emoticon_pos:
        tweet.replace(emoticon, "Good", tweet)
    for emoticon in emoticon_neg:
        tweet.replace(emoticon, "Bad", tweet)

    return(tweet)


def clean(tweet):
    """Clean given tweet to prepare for use in machine learning model"""
    

    # Replace emoticons
    tweet = replace_emoticons(tweet)
    # Replace emojis
    tweet = re.sub(r'[^\x00-\x7F]+','', tweet)
    # Remove HTML special entities
    tweet = re.sub(r"\&\w*;"," ", tweet)
    # Remove hyperlinks
    tweet = re.sub(r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\), ]|(?:%[0-9a-fA-F][0-9a-fA-F]))\S+",\
                    "", tweet)
    # Remove twitter usernames
    tweet = re.sub(r"@[^\s]+","", tweet)
    # Remove numbers
    tweet = re.sub("\d+", "", tweet)
    # Remove special characters
    tweet = re.sub(r"[^\w\s]", " ", tweet)
    tweet = re.sub(r"\_", " ", tweet)
    # Remove 1 letter words
    tweet = re.sub(r"\W*\b\w\b", "", tweet)
    # Remove leftover whitespace
    if tweet:
        tweet = " ".join(tweet.split())
    # Make lowercase
    tweet = tweet.lower()
    
    return(tweet)