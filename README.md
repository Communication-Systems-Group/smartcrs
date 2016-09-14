#What is SmartCRS?
SmartCRS is a peer-to-peer class room response system (CRS) utilizing the WebRTC protocol. It enables lecturers to ask questions to a broad number of students and having their answers visualized in real-time. Additionally, the students can ask questions. Whether the lecturer is notified of a student comment depends on the notification settings. These settings define how many up-votes a student comment requires until a notification for the lecturer is fired.

#Motivation
Only a small number of students is asking questions during a lecture. Stowell et al. found that 66% of the students don’t ask any questions. 17% of the students are responsible for 89% of the questions asked. One of the most often reported reasons why most students don't ask questions is the [fear of being regarded as less intelligent by peer students](http://www.tandfonline.com/doi/abs/10.1080/00986281003626631).

A CRS can help a lecturer to get a better idea of how well the students are able to follow the lecture. If there are a larger number of wrong student answers, the lecturer can use this information to actively ask back what is unclear.
With SmartCRS students can also ask questions. By allowing other students to up-vote a student question, the lecturer gets a better understanding of how many other students are stuck with the same question. SmartCRS is one of the few CRS that allow the students to ask questions to the lecturer. We are aware of one more tool which allows this: [Tweedback](https://www.e-teaching.org/materialien/apps/tweedback). SmartCRS's unique feature is that it uses WebRTC to allow a peer-to-peer connection between the students and the lecturer.


#Features

* **Lecturer**
    * Create and share 3 types of questions:
        * Multiple Choice Questions
        * Rating Questions
        * Open Questions
    * Share files/links/comments with your students
    * Receive comments from your students during the lecture
    * You can define the number of up-votes a comment must have until you are notified.
        * There are different notification types to choose from such as:
            * Playing a sound sample
            * Showing a notification popup (which shows up even if you’re in a PowerPoint presentation)
            * You can choose not to be notified during the lecture at all
    * The student answers are available at any time and are visualized in real-time
    * All questions, answers, comments and files can be saved as text file. 
    * Statistics can be exported as .xls file.
    * Guided tour
* **Students**
    * Answer lecturer questions
    * Write comments to the lecturer
    * Rate other students’ comment
    * Save asked questions
    * Auto-reconnect and login on browser refresh

# Live Demo & Interactive Tour
**Lecturer:**
http://nodejs2.csg.uzh.ch/lecturerRun.html (click on the SmartCRS Logo at the top right for an interactive tour)

**Students:**
http://nodejs2.csg.uzh.ch/students.html 

# Getting Started

1. Clone this repository
2. Import pom.xml into your favourite IDE
3. Install NodeJS
4. Run 'npm install' within the project's root directory
5. Open /settings.js and change the value at 'httpServerIP' to 'localhost'
6. Run 'node runServer' in the project's root directory and connect to the URL that is printed out

# Running Tests
The Java Selenium tests can be found in /src/test/java/
Type 'mvn test' in the project's root directory to run the tests.

To configure which peer should use which browser take a look at /src/test/java/framework/Settings.java.

# Deployment Instructions
SmartCRS comes with a Guntfile that you can adapt to your needs.
Note that our Gruntfile expects a 'secret.json' file in the project's root directory. It is used for ssh and sftp connections and has the following format:

    {
        "host": "yourHost", // e.g. nodejs2.csg.uzh.ch
        "username": "Username",
        "passphrase": "Password",
        "privateKey": "locationOfYourKeyFile.ppk"
    }

# Browser Support
SmartCRS has been tested to work with:

* Firefox v47+
* Chrome v51+

It might also work with the newest Opera version.

# Design
![Design2.0.png](https://bitbucket.org/repo/GM4AKR/images/623887591-Design2.0.png)

As shown in the image above, there is no direct messaging between the student peers. Instead, the lecturer receives all messages from the students. This has the advantage, that the lecturer can modify the received messages before broadcasting them to the other students. There are two different types of messages that the students can actively trigger:

* Sending a question to the lecturer
* Upvoting a student question

On receiving a student question, the lecturer peer sets the date & time of the message to his current time. He then broadcasts the question to all students including the student peer that posed the question. This ensures that all peers have the exact same order of messages even if one of the active student should be out of sync.
On receving a upvote, the lecturer peer checks that this peer has not already upvoted this question before. He then broadcasts the upvote to all peers.

WebRTC requires an initial bootstrapping process during which the peers exchange information on how to connect to each other. If the network setup of one of the peers doesn't allow direct connections, it is necessary to have a STUN server installed. If both lecturer and students are behind a firewall, a TURN server must be installed that relays the traffic. We are using [Coturn](https://github.com/coturn/coturn/wiki/turnserver) as STUN/TURN server for our [demonstration page](http://nodejs2.csg.uzh.ch/lecturerRun.html). We noticed during our own test-runs that the connection over the TURN server is not very stable. However, we could not find the root cause for this. As a result we added two new features that help to cope with this:

* An auto-reconnect function that automatically reauthenticates a disconnected student and allows him to join the room again within seconds by refreshing the browser.
* Each student sends a ping every 5 seconds and receives a pong from the lecturer. This has been implemented to ensure that the connection is not closed prematurely due to inactivity.

##Libraries

* [Bootstrap](http://getbootstrap.com/)
* [Bootstrap Toggle](http://www.bootstraptoggle.com/)
* [Bootstrap Tour](http://bootstraptour.com/)
* [ExcellentExport.js](https://github.com/jmaister/excellentexport)
* [Grunt](http://gruntjs.com/)
* [handlebars](http://handlebarsjs.com/)
* [jquery-comments](http://viima.github.io/jquery-comments/)
* [jQuery UI](https://jqueryui.com/)
* [jQuery](https://jquery.com/)
* [noUiSlider](http://refreshless.com/nouislider/)
* [RequireJS](http://requirejs.org/)
* [SimpleWebRTC](https://simplewebrtc.com/)
* [Selenium](http://docs.seleniumhq.org/)
* [Webix](http://webix.com/)

# Maintainers
Till Salinger 
(till.salinger /noSpam\ uzh.ch)

# Copyright and license
Code and documentation copyright 2016 Till Salinger. Code released under the GPL license.