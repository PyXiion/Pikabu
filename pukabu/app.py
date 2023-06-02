import functools

from flask import(
    Blueprint, flash, g, redirect, render_template, request, session, url_for, make_response
)

bp = Blueprint('index', __name__, url_prefix='/')

@bp.route('/')
@bp.route('/<feedmode>')
def index(feedmode='best'):
    if not feedmode in ['best', 'hot', 'new']:
        return redirect('/')
    
    resp = make_response(render_template('feed.html', feedmode=feedmode.title()))

    return resp

@bp.route('/story/<int:story_id>')
def story(story_id):
    return render_template('story.html', story_id=story_id)