from google.appengine.ext import ndb
import webapp2_extras.appengine.auth.models as auth_models
from bunch import *
import json

class CustomUser(auth_models.User):
    username = ndb.StringProperty(required = True)
    admin = ndb.BooleanProperty(default = False)
    current_task = ndb.KeyProperty()
    current_deadline = ndb.DateTimeProperty()

class Task(ndb.Model):
    description = ndb.TextProperty(required = True)
    category = ndb.StringProperty(repeated = True)

    @staticmethod
    def listJSON():
        tasks = Task.query().fetch(1000)

        task_list = []
        json_string = "["

        for i in range(len(tasks)):
            t = tasks[i]
            item = Bunch(  key = t.key.urlsafe()
                         , category = t.category
                         , description = t.description)

            task_list.append(item)
            json_string += json.JSONEncoder().encode(item)

            if not i == len(tasks) - 1:
                json_string += ", "

        #import pdb
        #pdb.set_trace()

        return json_string + "]"

#        return json.JSONEncoder().encode(task_list)

#        return json.JSONEncoder().encode(json_string)

class CompleteTask(ndb.Model):
    task = ndb.KeyProperty(kind = Task)
    date_complete = ndb.DateTimeProperty(auto_now_add = True)
    comment = ndb.TextProperty()
    userid = ndb.StringProperty()

class CurrentTask(ndb.Model):
    task = ndb.KeyProperty(kind = Task)
    deadline = ndb.DateTimeProperty()