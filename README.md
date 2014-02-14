# Always Better

Always Better is an experimental fork of the Better Errors gem (it's README is intact, below) that gives you live REPL on the current page. This allows you to basically use Better Errors when there is no error.

![image](http://i.imgur.com/QdvQN3g.png)


## Installation

There are two steps, adding this to your Gemfile (requires binding of caller) and installing the Chrome Extension.

1. Make sure you have the binding_of_caller gem
2. Clone this repo
3. Edit your Gemfile to point to this repo on your machine (gem "better_errors", :path => "/path/to/better_errors")
4. In Chrome, go to the url chrome://extensions
5. Click on "Load unpacked extension..."
6. In the dialog window, go to where you cloned this project and select the "always_better_ext" directory.


## Usage

1. Go to you rails app in Chrome. Note: Will only trigger when the project is being run from localhost:3000
2. Open Chrome Devtools
3. Click on "Rails C" tab
4. At the bottom the panel, type in any rails command as if you were in the debugger, such as "current_user"


## TODO

1. Keep history when switching pages
2. Fix issue when resizing Chrome Devtools window
3. Syntax coloring
4. Better way to recognize a ruby project that supports this than making sure the url is localhost:3000
5. Chrome extension refactor (was thrown together as proof-of-concept)

## Credits

Many thanks to [charliesome](https://github.com/charliesome) for Better Errors.

---


# Better Errors [![Build Status](https://travis-ci.org/charliesome/better_errors.png)](https://travis-ci.org/charliesome/better_errors) [![Code Climate](https://codeclimate.com/github/charliesome/better_errors.png)](https://codeclimate.com/github/charliesome/better_errors)

Better Errors replaces the standard Rails error page with a much better and more useful error page. It is also usable outside of Rails in any Rack app as Rack middleware.

![image](http://i.imgur.com/6zBGAAb.png)

## Features

* Full stack trace
* Source code inspection for all stack frames (with highlighting)
* Local and instance variable inspection
* Live REPL on every stack frame

## Installation

Add this to your Gemfile:

```ruby
group :development do
  gem "better_errors"
end
```

If you would like to use Better Errors' **advanced features** (REPL, local/instance variable inspection, pretty stack frame names), you need to add the [`binding_of_caller`](https://github.com/banister/binding_of_caller) gem by [@banisterfiend](http://twitter.com/banisterfiend) to your Gemfile:

```ruby
gem "binding_of_caller"
```

This is an optional dependency however, and Better Errors will work without it.

## Security

**NOTE:** It is *critical* you put better\_errors in the **development** section. **Do NOT run better_errors in production, or on Internet facing hosts.**

You will notice that the only machine that gets the Better Errors page is localhost, which means you get the default error page if you are developing on a remote host (or a virtually remote host, such as a Vagrant box). Obviously, the REPL is not something you want to expose to the public, but there may also be other pieces of sensitive information available in the backtrace.

To poke selective holes in this security mechanism, you can add a line like this to your startup (for example, on Rails it would be `config/environments/development.rb`)

```ruby
BetterErrors::Middleware.allow_ip! ENV['TRUSTED_IP'] if ENV['TRUSTED_IP']
```

Then run Rails like this:

```shell
TRUSTED_IP=66.68.96.220 rails s
```

Note that the `allow_ip!` is actually backed by a `Set`, so you can add more than one IP address or subnet.

**Tip:** You can find your apparent IP by hitting the old error page's "Show env dump" and looking at "REMOTE_ADDR".

**VirtualBox:** If you are using VirtualBox and are accessing the guest from your host's browser, you will need to use `allow_ip!` to see the error page.

## Usage

If you're using Rails, there's nothing else you need to do.

If you're not using Rails, you need to insert `BetterErrors::Middleware` into your middleware stack, and optionally set `BetterErrors.application_root` if you'd like Better Errors to abbreviate filenames within your application.

Here's an example using Sinatra:

```ruby
require "sinatra"
require "better_errors"

configure :development do
  use BetterErrors::Middleware
  BetterErrors.application_root = __dir__
end

get "/" do
  raise "oops"
end
```

### Unicorn, Puma, and other multi-worker servers

Better Errors works by leaving a lot of context in server process memory. If
you're using a web server that runs multiple "workers" it's likely that a second
request (as happens when you click on a stack frame) will hit a different
worker. That worker won't have the necessary context in memory, and you'll see
a `Session Expired` message.

If this is the case for you, consider turning the number of workers to one (1)
in `development`. Another option would be to use Webrick, Mongrel, Thin,
or another single-process server as your `rails server`, when you are trying
to troubleshoot an issue in development.

## Get in touch!

If you're using better_errors, I'd love to hear from you. Drop me a line and tell me what you think!

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
