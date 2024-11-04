# CS4311_INFILTR8_6TheNine-Bytes_Fall2024
## 🤖 SW2 INFILTR8 Development Repo
(Course Work) Breathing Implementation of the INFILTR8 system created by The Nine Bytes team. This is based on the finalized SRS and is to be finished at the end of the FALL 2024 Semester. [🧠]

<p align="center">
<img src="https://github.com/Azaze7/SW2-INFILTR8/blob/main/Initial-Dependencies-And-Resources/Infiltr8-Title-Page.png" height="200px"> 
</p>

## 🔎 Table of Contents.

1. Team Composition. [The Nine-Bytes]
2. Guidance Team & Customer Information. [DEVCOM]
3. What Files are Enclosed Here?
4. Tech Stack Foundation.
5. Install Instructions.
6. Vieo Demonstration.

## 🎏 Team Composition [The Nine-Bytes]

**This Project was completed through the cooperation of *nine* team members!**

[Gilbert I. Guzman](https://github.com/Azaze7 "Gilbert's Github") - *Team Lead/Analyst/Repo Master*: Created GitHub Repo, Communicated with Staff, Bugfixed code, Programmmed Colorblind Filters, Programmed Universal Fonts, Wrote Manual, Programmed Settings Page, Programmed Support Page, Programmed Analysis Page, Recorded Demo Videos.

[Alberto Villegas](https://github.com/bertvillegas "Alberto's Github") - *Quality Manager/Programmer*: Assisted In Creation of all UX, Bugfixed code, Collaborated on Reports UI, Assisted with Project Manager Frontend, Report Frontend.

[Brian Mata](https://github.com/donburgers "Brian's Github") - *Dataflow & Business Manager/Programmer*: Assisted In Creation of all UX, Bugfixed code, Created Database, Programmed Darkmode, Programmed Backend for login, Programmed Pulling/Pusing of data to database, Bugfixing for Sprint #4.

[Christian Garcia](https://github.com/chris-garcia01 "Christian G.'s Github") - *Quality Manager/V&V*: Assisted In Creation of all UX, Bugfixed code, Readme Assistance and Commentation, Assisted in settings UI, Analysis Page Backend.

[Christian Revilla ](https://github.com/carevilla "Christian R.'s Github") - *Analysis Manager/Programmer*: Assisted In Creation of all UX, Bugfixed code, Programmed Frontend for login, Programmed Routing of svelte pages, Taught teammates tailwind, Bugfixing for Sprint #4.

[Janelle Guzman](https://github.com/jbguzman "Janelle's Github") - *Customer Interface Manager/Designer*: Assisted In Creation of all UX, Bugfixed code, Assisted in backend logs, assisted with website design aethetics, Logs Page Frontend.

[Jose Luis Rojas](https://github.com/joseluisrojas21 "Jose's Github") - *Bahavioral Model Manager/Designer*: Assisted In Creation of UX, Bugfixed code, Assisted in frontend logs, assisted with initial database prototyping, Logs Page Backend.

[Kimberly Kocian](https://github.com/kkocian7 "Kimberly's Github") - *Support Manager/V&V*: Assisted In Creation of all UX, Bugfixed code, Assisted with Project Manager frontend, assisted with svelte routing, Project Manager fixing. 

[Luis Sanchez](https://github.com/ldsanchez3 "Luis's Github") - *Planning Manager/Analyst*: Assisted In Creation of all UX, Bugfixed code, Assisted with Project Manager Backend, general formatting, Reports Backend. 

<p align="center">
<img src="https://github.com/Azaze7/SW2-INFILTR8/blob/main/Initial-Dependencies-And-Resources/The%20Nine-Bytes-Logo.png" height="200px"> 
</p>

<p align="center">
Special Thanks to All of those who contributed! We could not do it without you!
</p>

## 🎖️ Guidance Team & Customer Information [DEVCOM] 

**The following individuals are the guidance team for the development of INFILTR8. They are:**

* Dr. Salamah Salamah - Manager

* Scott R. Ledford - TA

* Consuelo Ramirez – TA

**This Project is being worked on at the behest of the U.S. Army Combat Capabilities Development Command, also known as DEVCOM.**

**Our official customer list includes:**

* Sebastian Quinones  

* Diana Ramirez  

* Timothy Hannan  

* Lucia Rodriguez-Melgoza  

* Thomas Tenorio  

* Miriam Olague 	

<p align="center">
Team #6 extends its sincere gratitude to all of our customers and our guidance team! Thank you for believing in us!
</p>

## 🗂️ What Files are Enclosed Here?

| Filename | Type | Description | 
| --------------- | --------------- | --------------- |
| Gil-Test-Resources | 🗂️ | Contains Pre-fixed files to run the .nessus file. maing.py has been modified to handle new inputs and get a sample output. This is not the final version, and exists only for testing backend! |
| Initial-Dependecies-And-Resources | 🗂️ | Contains main source code, sample *broken* .nessus file, the finalized SRS, and some diagrams. These files will help kickstart development. |
| INFILTR8 | 🗂️ | Contains files necessary to build and run INFILTR8, including its backend and GUI. |
| README | .md | All of the text that you are currently reading. |
| install | .sh | Shell-script that installs the system for you. |
| .DS_Store | - | Stores folder customization options (MacOS Only). |

## 🖥️ Tech Stack Foundation

**The following table shows the technology to be used to develop INFILTR8, taken explicitly from the given SRS document.**

| Name | Type | Version | Description | 
| --------------- | --------------- | --------------- | --------------- |
| Github | Version Control | v1 | A web-based platform for version control and collaboration, using Git for managing code repositories. Will be used to store INFILTR8 as it develops. |
| JS | Language | v1 | JavaScript, a versatile scripting language primarily used for web development to create interactive effects within web browsers. [Used for Site].|
| Neo4j | Database | v1 | Graph database management system designed to store and query complex relationships between data. [Used for Backend].|
| Python | Langauge | v1 | High-level, interpreted programming language known for its readability and versatility. [Used for Code].|
| Tailwind | Library | v1 | Utility-first CSS framework for rapidly building custom user interfaces. [Used for Frontend].|

## 💾 Install Instructions
* After pulling GitHub code (via your preferred method), open the terminal in Split Terminal.

A. In terminal #1.
1. `cd` into the folder called "INFILTR8":
    ```bash
    cd INFILTR8
    ```

2. Install dependencies
    ```bash
    npm i
    ```

3. Fund if prompted to:
    ```bash
    npm fund
    ```

4. Build INFILTR8:
    ```bash
    npm run build
    ```

5. Start INFILTR8:
    ```bash
    npm run dev
    ```

B. In terminal #2.
1. `cd` into the folder called "INFILTR8":
    ```bash
    cd INFILTR8
    ```
    
2. `cd` into the folder called "server":
    ```bash
    cd server
    ```
    
3. Run the database:
    ```bash
    node server.js
    ```

***C. You can also use the install script if you’ve downloaded the source code from GitHub as a ZIP file.***

1. Run Install Script for Linux:
    ```bash
    ./install.sh
    ```


## 🎞️ Project Milestones & Video Demonstrations.

Short video archives demonstrating the various vertical slices for INFILTR8 have been recorded to show the software design process.

* DEMO #1 - README & GitHub Update, Non-Functional GUI, Data Storage, GitHub Configuration, DAC Added to GitHub, Stack Foundation & Project Dashboard.
* Due: [9/16/24].
* [Shipped].
  * https://youtu.be/wsV8tB8XbOw

* DEMO #2 - README & GitHub Update, Improved Database, Processing Recon Data, Allowed/Off-limit IP List, Entry Point Types Selection, & Start of Logs.
* Due: [9/30/24].
* [Shipped].
  * https://youtu.be/GIlSGcYOIUc

* DEMO #3 - README & GitHub Update, "AI Algorithm" Integration, GUI Update, Database Update, & Logs Update.
* Due: [10/18/24].
* [Shipped].
  * https://youtu.be/xTV-pyUmyZs

* DEMO #4 - README & GitHub Update, AI Algorithm Integration (Finalized), Analysis Page Execution, Analysis Progress Display, Upload .nessus via GUI, & Logs Update.
* Due: [10/28/24].
* [Shipped].
  * https://youtu.be/cFGu_UDyXlM

* DEMO #5 - README & GitHub Update, View Analysis Results, Export Analysis Results, Anaysis Scheduling, Filter Results.
* Due: [11/11/24].
* [Pending].
  * https://www.youtube.com/watch?v=t4JFM3Ws0uA

* DEMO #6 - README & GitHub Update, INFILTR8 Installer, All Tech Debt Resolved, Clean GitHub Repo, Final Demo Video.
* Due: [12/2/24].
* [Pending].
  * https://www.youtube.com/watch?v=t4JFM3Ws0uA
