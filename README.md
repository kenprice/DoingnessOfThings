# DoingnessOfThings
Doingness of things every day. Based on my team's project for ASU's Hacks For Humanity 2014 hackathon.

- User should be able to pick a daily task from 3 randomly generated tasks, and have 24 hours to complete it.
- Upon completion, user should be able to navigate the app's main screen and click a button to indicate completion.
- If 24 hour timer runs out & user didn't finish task, mission failed! User given option to pick new task.
- User can log in / sign up to save their information (optional)
- A log of activity is available online for registered users.
- Tasks have 7 categories & can take on multiple categories. 7 categories: forgiveness, respect, kindness, integrity, empathy, self-reflection, compassion.
- User's activity log shows which categories have been completed.
- Generated task list based on history: more likely to show category of the tasks user is lacking.

# Mobile App
- Persistent local storage of user information and task list.
- Store tasks in remote database. Retrieve and store locally as JSON.
- Upon registration, store user ID locally. Login still optional.
- User login/authenticated access to server will 'sync' local data to server for storage.
- Match locally stored data w/ log in ID upon login success.