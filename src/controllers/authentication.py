from webapp2_extras import auth
from wtforms import Form, TextField, PasswordField, validators
import logging
from controllers.server import Handler

'''
SIGNUP / LOGIN / LOGOUT HANDLERS
'''

def login_required(handler):
    "Requires that a user be logged in to access resource"
    def check_login(self, *args, **kwargs):
        if not self.user:
            return self.redirect_to('login')
        else:
            return handler(self, *args, **kwargs)

    return check_login


class SignupForm(Form):
    username = TextField('username'
                      ,[validators.Required()])
    password = PasswordField('Password'
                      ,[validators.Required()
                       ,validators.EqualTo('password_confirm',
                                           message="Passwords must match.")])
    password_confirm = PasswordField('Confirm Password'
                      ,[validators.Required()])

class LoginForm(Form):
    username = TextField('username', [validators.Required()])
    password = PasswordField('Password', [validators.Required()])


## HANDLERS
## --------
class SignupHandler(Handler):
    "Serves up a signup form, creates new users"
    def get(self):
        self.render_response("auth/signup.html", form=SignupForm())

    def post(self):
        form = SignupForm(self.request.POST)
        error = None

        logging.error({form.username.data, form.password.data, form.password_confirm.data})

        logging.error(form.validate())

        if form.validate():
            success, info = self.auth.store.user_model.create_user(
                "auth:" + form.username.data
                ,unique_properties=['username']
                ,username = form.username.data
                ,admin = True
                ,password_raw = form.password.data)

            if success:
                self.auth.get_user_by_password("auth:"+form.username.data
                                               , form.password.data)
                return self.redirect_to("home")
            else:
                error = "Something went wrong."

        error = "Form not valid"

        self.render_response("auth/signup.html", form=form, error=error)


class LoginHandler(Handler):
    def get(self):
        self.render_response("auth/login.html", form=LoginForm())

    def post(self):
        form = LoginForm(self.request.POST)
        error = None
        if form.validate():
            try:
                self.auth.get_user_by_password("auth:" + form.username.data
                                               ,form.password.data)
                return self.redirect_to('home')

            except (auth.InvalidAuthIdError, auth.InvalidPasswordError):
                error = "Invalid username or password"

        self.render_response("auth/login.html", form=form, error=error)


class LogoutHandler(Handler):
    #Destroy user session & return to login screen
    @login_required
    def get(self):
        self.auth.unset_session()
        self.redirect_to('login')


