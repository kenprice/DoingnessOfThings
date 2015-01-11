from webapp2_extras import sessions
from webapp2_extras import auth
from webapp2_extras import jinja2
import webapp2

'''
TEMPLATE STUFF
'''
def jinja2_factory(app):
    "Method for attaching additional globals/filters to jinja"
    j = jinja2.Jinja2(app)
    j.environment.globals.update({'uri_for' : webapp2.uri_for})
    return j

'''
CUSTOM REQUEST HANDLER
'''
#Base class for request handler
class Handler(webapp2.RequestHandler):
    #AUTHENTICATION & SESSIONS
    #-------------------------
    @webapp2.cached_property
    def session_store(self):
        return sessions.get_store(request=self.request)

    @webapp2.cached_property    #Allows method to be accessed as cached property
    def session(self):
        return self.session_store.get_session(backend="datastore")

    #persist changes made to session object
    def dispatch(self):
        try:
            super(Handler, self).dispatch()
        finally:
            #save the session after each request
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def auth(self):
        return auth.get_auth(request=self.request)

    @webapp2.cached_property
    def user(self):
        user = self.auth.get_user_by_session()
        return user

    @webapp2.cached_property
    def user_model(self):
        user_model, timestamp = self.auth.store.user_model.get_by_auth_token(
                                self.user['user_id']
                                , self.user['token']) \
                                if self.user else (None, None)
        return user_model

    #RENDERING AND TEMPLATES
    #-----------------------
    def write(self, *a, **kw):                  #write normal way, or with named parameters
        self.response.out.write(*a, **kw)

    @webapp2.cached_property
    def jinja2(self):
        return jinja2.get_jinja2(factory=jinja2_factory, app=self.app)

    def render_response(self, _template, **context):
        ctx = {'user' : self.user_model}
        ctx.update(context)

        rv = self.jinja2.render_template(_template, **ctx)
        self.response.write(rv)