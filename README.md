# CS4311_INFILTR8_6TheNine-Bytes_Fall2024
## 🤖 SW2 INFILTR8 Development Repo
(Course Work) Breathing Implementation of the INFILTR8 system created by The Nine Bytes team. This is based on the finalized SRS and is to be finished at the end of the FALL 2024 Semester. [🧠]

<p align="center">
<img src="https://github.com/Azaze7/SW2-INFILTR8/blob/main/Initial-Dependencies-And-Resources/Infiltr8-Title-Page.png" height="200px"> 
</p>

## 🔎 Table of Contents.

1. Team Composition [The Nine-Bytes] 
2. What Files are Enclosed Here?
3. Tech Stack Foundation.
4. Install Instructions
5. Vieo Demonstration.

## 🎏 Team Composition [The Nine-Bytes]

**This Project was completed through the cooperation of *nine* team members!**

[Gilbert I. Guzman](https://github.com/Azaze7 "Gilbert's Github") - *Team Lead/Analyst/Repo Master*: Created GitHub Repo, Communicated with Staff, Bugfixed code, ...

[Alberto Villegas](https://github.com/bertvillegas "Alberto's Github") - *Quality Manager/Programmer*: Assisted In Creation of all UX, Bugfixed code, ...

[Brian Mata](https://github.com/donburgers "Brian's Github") - *Dataflow & Business Manager/Programmer*: Assisted In Creation of all UX, Bugfixed code, ...

[Christian Garcia](https://github.com/chris-garcia01 "Christian G.'s Github") - *Quality Manager/V&V*: Assisted In ...

[Christian Revilla ](https://github.com/carevilla "Christian R.'s Github") - *Analysis Manager/Programmer*: Assisted In Creation of all UX, Bugfixed code, ...

[Janelle Guzman](https://github.com/jbguzman "Janelle's Github") - *Customer Interface Manager/Designer*: Assisted In ...

[Jose Luis Rojas](https://github.com/joseluisrojas21 "Jose's Github") - *Bahavioral Model Manager/Designer*: Assisted In ...

[Kimberly Kocian](https://github.com/kkocian7 "Kimberly's Github") - *Support Manager/V&V*: Assisted In ...

[Luis Sanchez](https://github.com/ldsanchez3 "Luis's Github") - *Planning Manager/Analyst*: Assisted In ...

<p align="center">
<img src="https://github.com/Azaze7/SW2-INFILTR8/blob/main/Initial-Dependencies-And-Resources/The%20Nine-Bytes-Logo.png" height="200px"> 
</p>

<p align="center">
Special Thanks to All of those who contributed! We could not do it without you!
</p>

## 🗂️ What Files are Enclosed Here?

| Filename | Type | Description | 
| --------------- | --------------- | --------------- |
| Gil-Test-Resources | 🗂️ | Contains Pre-fixed files to run the .nessus file. maing.py has been modified to handle new inputs and get a sample output. This is not the final version, and exists only for testing backend! |
| Initial-Dependecies-And-Resources | 🗂️ | Contains main source code, sample *broken* .nessus file, the finalized SRS, and some diagrams. These files will help kickstart development. |
| my-app | 🗂️ | Contains files necessary to build and run INFILTR8, including its backend and GUI. |
| README | .md | All of the text that you are currently reading. |
| install | .sh | Shell-script that installs the system for you. |
| .DS_Store | - | Stores folder customization options (MacOS Only). |

## 🖥️ Tech Stack Foundation

**The following table shows the technology to be used to develop INFILTR8, taken explicitly from the given SRS document.**

| Name | Type | Description | 
| --------------- | --------------- | --------------- |
| Github | Version Control | A web-based platform for version control and collaboration, using Git for managing code repositories. Will be used to store INFILTR8 as it develops. |
| JS | Language | JavaScript, a versatile scripting language primarily used for web development to create interactive effects within web browsers. [Used for Site].|
| Neo4j | Database | Graph database management system designed to store and query complex relationships between data. [Used for Backend].|
| Python | Langauge | High-level, interpreted programming language known for its readability and versatility. [Used for Code].|
| Tailwind | Library | Utility-first CSS framework for rapidly building custom user interfaces. [Used for Frontend].|

## 💾 Install Instructions
1. After pulling GitHub code, open terminal.

2. `cd` into the folder called "my-app":
    ```bash
    cd my-app
    ```

3. Install dependencies:
    ```bash
    npm i
    ```

4. Build INFILTR8:
    ```bash
    npm run build
    ```

5. Start INFILTR8:
    ```bash
    npm run dev
    ```

Or use the install script if you’ve downloaded the source code from GitHub as a ZIP file.

```bash
./install.sh
```

## 🎞️ Video Demonstration.

* Videos demonstrating the various vertical slices for INFILTR8 have been recorded for archive purposes.
* 
* DEMO #1 - Non-Functional GUI, Data Storage, GitHub Configuration, & Project Dashboard.
* [9/16/24]
  * https://youtu.be/wsV8tB8XbOw
* 
* DEMO #2 - GUI Update, Improved GitHub & Database, Processing Recon Data, Allowed/Off-limit IPs, Entry Point Selection, & Start of Logs.
* [9/30/24]
  * https://youtu.be/wsV8tB8XbOw

