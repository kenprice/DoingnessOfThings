from google.appengine.ext.webapp.util import run_wsgi_app

from datetime import *

from models.models import *

from controllers.authentication import *
from controllers.adminpages import *

from random import randint

import json

'''
REQUEST HANDLERS
'''
class RootPage(Handler):
    def get(self):
        pass


#URL: /user/newtask
class UserNewTaskHandler(Handler):
    def render_page(self, tasks = None, user = None):
        self.render_response("admin/user_assigntask.html", tasks = tasks, user = user)

    @login_required
    def get(self):
        tasks = Task.query().fetch(1000)    #List of Task objects
        number_of_tasks = len(tasks)

        logging.error("Number of tasks: " + str(number_of_tasks))

        while True:
            task1 = randint(0, number_of_tasks - 1)
            task2 = randint(0, number_of_tasks - 1)
            task3 = randint(0, number_of_tasks - 1)
            if ((task1 != task2) and (task1 != task3) and (task2 != task3)):
                break

        task1 = tasks[task1]
        task2 = tasks[task2]
        task3 = tasks[task3]

        self.render_response("pickatask.html", task1 = task1, task2 = task2, task3 = task3)

    @login_required
    def post(self):
        taskString = self.request.get("taskString")

        if taskString:
            #Could raise error of urlString is invalid

            user = self.user_model
            if user.current_task:
                taskKey = ndb.Key(urlsafe = taskString)
                user.current_task = taskKey  #key of selected task

                oneday = timedelta(days = 1)
                logging.error(datetime.urcnow())
                user.current_deadline = datetime.utcnow() + oneday
                logging.error(user.curDeadline)

#URL: /user
class UserFrontHandler(Handler):
    @login_required
    def get(self):
        logging.error("UserFrontHandler")
        logging.error(self.user_model)

        user = self.user_model

        username = user.username
        #user.current_task is NDB key to a Task entity
        if not user.current_task:
            current_task = "None"
            current_deadline = "None"
        else:
            current_task = user.current_task.get().description
            current_deadline = user.current_deadline.strftime("%Y-%m-%d %H:%M:%S")

        self.render_response("userfront.html"
                             ,username = username
                             ,current_task = current_task
                             ,current_deadline = current_deadline)

        #self.redirect("/user/" + userid + "/newtask")

class RetrieveTasklistJSON(Handler):
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        self.write(Task.listJSON())

'''
CONFIG AND APP
'''
config = {}
config['webapp2_extras.sessions'] = {'secret_key' : 'Super-Secret_Key'}
config['webapp2_extras.auth'] = {'user_model': CustomUser}

SITE_ROUTES = [ webapp2.Route(r'/', handler=RootPage, name='home')
                ,webapp2.Route(r'/signup', handler=SignupHandler, name='signup')
                ,webapp2.Route(r'/login', handler=LoginHandler, name='login')
                ,webapp2.Route(r'/logout', handler=LogoutHandler, name='logout')
                ,webapp2.Route(r'/admin/task/add', handler=TaskAddHandler, name="admin-taskadd")
                ,webapp2.Route(r'/admin/task/delete/<urlString>', handler=TaskDeleteHandler, name="admin-taskdelete")
                ,webapp2.Route(r'/admin/task/edit/<urlString>', handler=TaskEditHandler, name="admin-taskedit")
                ,webapp2.Route(r'/admin/task', handler=TaskConsoleHandler, name="admin-tasklist")
                ,webapp2.Route(r'/user', handler=UserFrontHandler, name="user-frontpage")
                ,webapp2.Route(r'/user/newtask', handler=UserNewTaskHandler, name="user-newtask")
                ,webapp2.Route(r'/tasklist.json', handler=RetrieveTasklistJSON, name="retrieve-tasklist") ]

app = webapp2.WSGIApplication(SITE_ROUTES, debug=True, config = config)


def main():
    run_wsgi_app(app)

if __name__ == "__main__":
    main()
