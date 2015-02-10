# MordheimOrcs
Orc Initial Roster Calculator based on the Mordheim Game
http://goo.gl/xKP6DQ

**Mordheim:**
Table top minitures game with a 100+ page rulebook... quiet overwhelming for a new player, so this tool tries to simplify that.

**What does this do?**
Simplistically this webpage is all front-end no back-end (I wanted it to work even if the user is currently offline) and all this webpage is doing is allowing the user to add rows in a table by clicking the drop down, and seeing how that changes some values on the Right, and some requirements and recommendations on the left.
Also provided on hover over information boxes for each requirement/recommendation.

Internally in the JavaScript it is keeping track of a dozen pieces of information per row, which are detailed in the top of the 'army.js' file and I am enforcing the rules of the game by either:
a) Preventing the user from going over a limit by graying an option out - (such as a when 2 Big'Uns are added they become grayed out, and when the max quantity 5 is reached the '+' is grayed out) or 
b) by notifying the user that they have exceeded the rules with turning a requirement red - (such as spending over 500gold or adding more than 20 models.) or
c) by only showing the options that are available - (such as the equipment dropdown for a Goblin is different than Orc and Troll can't use any). 
