# Angular Demo Dashboard

### Setup
This has been created using <a href="https://www.apachefriends.org/download.html" target="_blank">XAMPP Apache hosting (PHP 5.6)</a>
It can be run from any APACHE instance running, simply put the folder in the desired web server location.
<br />
**NOTE: mod_rewrite is required**

Next is to create your database which can easily use the XAMPP phpmyadmin tool (default: http://localhost/phpmyadmin)
Navigate to **Import** and select the **intouch_crunchbase_monthly.zip** file (default settings should suffice).

Once your database is up and running, set your database settings (user/password) under **demo_dashboard/api/database.php**

Now that the back-end is ready, use command-line and cd to your **client** directory
and run the following commands:
<br />
`
npm install && bower install
`

**OPTIONAL: You can run tests by running the following command in your client directory:**
<br />
`
karma start
`

Head on over to your browser and navigate to the folder using your localhost (ex http://localhost/demo_dashboard/client/app) 
and *Voila!*

### What's this?
A fresh new look at dashboards! We've integrated a more modern look and feel using Google's Material Design to make the graphs really stick out.
The product will have user authentication and display charts containing important data they want to see right away.
For some of the yearly statistics, they will be able to jump to previous years and make comparisons easily.

Trending Markets can be controlled by selecting a country from the select drop-down at the top of the charts.

The Top 10 Countries By Company Count can be looked by province/state by clicking on a country's bar (from the bar graph). They can also return to the overrall company count by clicking the arrow next to the title.

The dashboard features are responsive, meaning they will resize and fit nicely on a tablet or mobile phone.

### Future Roadmap
<img src="Feature board for Dashboard Roadmap.png" />
