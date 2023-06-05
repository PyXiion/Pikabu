import functools

from flask import(
    Blueprint, flash, g, redirect, render_template, request, session, url_for, make_response
)

bp = Blueprint('index', __name__, url_prefix='/')

feedmodes = [
    'best', 'best24', 'best7', 'best30',
    'hot', 'hot_act', 
    'new', 'subs', 'upcoming', 
    'interested', 'coronavirus',
    'stay_home', 'not-interested',
    'companies',
]

@bp.route('/')
@bp.route('/<feedmode>')
def index(feedmode='best'):
    if not feedmode in feedmodes:
        return redirect('/')
    
    resp = make_response(render_template('feed.html', feedmode=feedmode.title()))

    return resp

@bp.route('/story/<int:story_id>')
def story(story_id):
    return render_template('story.html', story_id=story_id)

@bp.route('/@<username>')
@bp.route('/user/<username>')
def profile(username):
    return render_template('profile.html', username=username)