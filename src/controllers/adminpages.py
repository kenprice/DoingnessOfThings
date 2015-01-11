from google.appengine.ext import ndb
from controllers.server import Handler
from models.models import Task
import webapp2

'''
SIGNUP / LOGIN / LOGOUT HANDLERS
'''
def admin_login_required(handler):
    "Requires that an admin user be logged in to access resource"
    def check_admin_login(self, *args, **kwargs):
        if not self.user:
            return self.redirect_to('home')

        if self.user_model.admin:
            return handler(self, *args, **kwargs)
        else:
            return self.redirect_to('home')

    return check_admin_login

#URL: admin/task/
class TaskConsoleHandler(Handler):
    @admin_login_required
    def get(self):
        tasks = Task.query()

        for task in tasks:
            task.id = task.key.urlsafe()

        self.render_response("admin/taskconsole.html", tasks = tasks)

#URL: admin/task/add
class TaskAddHandler(Handler):
    @admin_login_required
    def get(self):
        self.render_response("admin/tasknew.html"
                             , error = ""
                             , description = ""
                             , category = None)

    @admin_login_required
    def post(self):
        description = self.request.get("description")
        category = self.request.get("category")

        if description and category:
            a = Task(description = description, category = category.split('\n'))
            a.put()

            self.redirect("/admin/task")
        else:
            error = "We need both description and categories!"
            self.render_response("admin/taskconsole.html", error = error, description = description, category = category)


#URL: admin/task/edit/XXX
class TaskEditHandler(Handler):
    def render_page(self, error = "", description = "", category = None):
        self.render_response("admin/taskedit.html", error = error, description = description, category = category)

    @admin_login_required
    def get(self, urlString):
        task_key = ndb.Key(urlsafe = urlString)
        task = task_key.get()
        self.render_page(error = "", description = task.description, category = task.category)

    @admin_login_required
    def post(self, urlString):
        task_key = ndb.Key(urlsafe = urlString)
        task = task_key.get()

        description = self.request.get("description")
        category = self.request.get("category")

        if description and category:
            cat_list = category.split('\n')
            cat_list = filter(lambda x: len(x) > 1, cat_list)
            cat_list = [c.replace('\r', '') for c in cat_list]

            task.description = description
            task.category = cat_list
            task.put()

            self.redirect("/admin/task")
        else:
            error = "We need both description and categories!"
            self.render_page(error = error, description = description, category = category)

#URL: /admin/task/delete/XXX
class TaskDeleteHandler(Handler):
    @admin_login_required
    def get(self, urlString):
        task_key = ndb.Key(urlsafe = urlString)
        task_key.delete()
