var MenuItem = React.createClass({
  render: function(){
    return(
      <span className={this.props.classes}>
        <a className={this.props.link_class} onclick={this.props.onclick} href={this.props.href}>{this.props.text}</a>
      </span>
    )
  }
})
var Navbar = React.createClass({
  render: function(){
    var loginButton, signupButton, myEventsButton, newEventButton;
    if (document.cookie == "false") {
      loginButton = <MenuItem classes="u-pull-right margin-right-50" link_class="button" href="login.html" text="Login" />;
      signupButton = <MenuItem classes="u-pull-right" link_class="button button-primary" href="register.html" text="Signup" />
      myEventsButton = null;
      newEventButton = null;
      event
    } else {
      loginButton = <MenuItem classes="u-pull-right margin-right-50" link_class="button" text="Logout" id="logout_button" />;
      signupButton = null;
      myEventsButton = <MenuItem classes="u-pull-left margin-right-50" link_class="button" href="events.html" text="My Events" />
      newEventButton = <MenuItem classes="u-pull-left" link_class="button" href="create_event.html" text="New Event" />
    }
    return(
      <nav className="row navbar">
        <a className="brand u-pull-left" href="index.html">Shindig</a>
        {myEventsButton}
        {newEventButton}
        {signupButton}
        {loginButton}
      </nav>
    )
  }
});

ReactDOM.render( <Navbar /> , document.getElementById('header'));
