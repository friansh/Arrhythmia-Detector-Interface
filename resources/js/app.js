/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require("./bootstrap");

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require("./components/User/Dashboard");
require("./components/User/Profile");

require("./components/Doctor/Dashboard");
require("./components/Doctor/Raw");
require("./components/Doctor/Classified");
require("./components/Doctor/Messages");

require("./components/Admin/Dashboard");
require("./components/Admin/Promote");
require("./components/Admin/ManageUser");
require("./components/Admin/ManageDoctor");

require("./components/User/History");
require("./components/User/Raw");
require("./components/User/Classified");

require("./components/SignIn");
require("./components/SignUp");
