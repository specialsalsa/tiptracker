# tiptracker

tipTracker helps DoorDash drivers make smarter decisions on which order to take by allowing you to rate each offer you receive, as well as each order you fulfill.

When you get an order, the app will check the address against the database and attempt to find a match for previously recorded data. If a match is found, the app will notify you with your last recorded data for that address. If no match is found, it will optionally ask you to preliminarily rate the order before accepting and completing it.

When you get close to the order dropoff, the app will ask you to rate how the customer tipped. The next time you get an order for that address, you will see your previous rating.

It is important to keep the DoorDash app in the background so that notifications about new orders come through for the tracker to read.

Version 0.0.3.0
   - Home screen now displays an RSS feed from doordashstatus.com if there has been an update in the past 30 minutes

Version 0.0.2.4
   - Notification access dialog now doesn't go away until you allow access - previously it was not always sending you to the settings screen
   - Slight tweaks to light theme

Version 0.0.2.3
   - Dark and light themes implemented

Version 0.0.2.2
   - Centered icons in buttons on tip log page

Version 0.0.2.1
   - Tip log should now show recently completed orders

Version 0.0.2.0
   - Initial tip log release

Version 0.0.1.9
   - Added database connection indicator to home screen

Version 0.0.1.8
   - Names of states in addresses now converted to their abbreviations for better database matches

Version 0.0.1.7
   - Fixed a bug where offers that weren't accepted would show up on the home screen

Version 0.0.1.6
   - Simple update banner displayed when app has been updated. Note you still need to force stop and reopen the app to get new updates (or download from here obv)

Version 0.0.1.5
   - Server upgraded to HTTPS

Version 0.0.1.4
   - Automatic updates implemented

Version 0.0.1.3
   - "Okay Tipper" card now more readable
   - Tip Alert now displays the rating in the notification title for better compatibility/smartwatch support

Version 0.0.1.2
   - Trimmed user inputs on Add New Tipper page. This should help with retrieving database matches

Version 0.0.1.1
   - Manual tip lookup page
