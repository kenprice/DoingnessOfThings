from google.appengine.ext import ndb
import webapp2_extras.appengine.auth.models as auth_models

class CustomUser(auth_models.User):
    username = ndb.StringProperty(required = True)
    admin = ndb.BooleanProperty(default = False)
    current_task = ndb.KeyProperty()
    current_deadline = ndb.DateTimeProperty()

class Task(ndb.Model):
    description = ndb.TextProperty(required = True)
    category = ndb.StringProperty(repeated = True)

class CompleteTask(ndb.Model):
    task = ndb.KeyProperty(kind = Task)
    date_complete = ndb.DateTimeProperty(auto_now_add = True)
    comment = ndb.TextProperty()
    userid = ndb.StringProperty()

class CurrentTask(ndb.Model):
    task = ndb.KeyProperty(kind = Task)
    deadline = ndb.DateTimeProperty()