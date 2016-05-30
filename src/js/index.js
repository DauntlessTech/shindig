var MenuItem = React.createClass({
  render: function(){
    return(
      <span className={this.props.classes}>
        <a className={this.props.link_class} href={this.props.href} id={this.props.id}>{this.props.text}</a>
      </span>
    )
  }
})
var Navbar = React.createClass({
  render: function(){
    var loginButton, signupButton, myEventsButton, newEventButton;
    if (document.cookie == "false") {
      loginButton = <MenuItem classes="u-pull-right margin-right-50" link_class="button" href="login.html" text="Login" />;
      signupButton = <MenuItem classes="u-pull-right" link_class="button button-primary" href="register.html" text="Signup" />;
      myEventsButton = null;
      newEventButton = null;
      event
    } else {
      loginButton = <MenuItem classes="u-pull-right margin-right-50" link_class="button" text="Logout" id="logout_button" />;
      signupButton = null;
      myEventsButton = <MenuItem classes="u-pull-left margin-right-50" link_class="button" href="events.html" text="My Events" />;
      newEventButton = <MenuItem classes="u-pull-left" link_class="button" href="create_event.html" text="New Event" />;
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

var LandingPage = React.createClass({
  render: function(){
    return(
      <div className="section banner_one">
        <div className="container">
          <div className="row">
            <div className="twelve columns text-center banner_message">
              <h2 className="banner_header">shindig <span className="banner_sub_header">events</span> </h2>
              <p className="banner_description">The simplest way to create and track events on all your devices.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var MainContent = React.createClass({
  render: function(){
    return(
      <div>
        <div className="container">
          <div className="row section">
            <div className="twelve columns text-center">
              <a href="register.html" className="button button-primary">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

ReactDOM.render( <Navbar /> , document.getElementById('header'));
ReactDOM.render( <LandingPage /> , document.getElementById('landing'));
ReactDOM.render( <MainContent /> , document.getElementById('content'));


//REVIEW check over landing page html
