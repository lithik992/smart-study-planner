// ==========================================
// SMART STUDY PLANNER
// ==========================================

let topics =
    JSON.parse(
        localStorage.getItem("smartStudyTopics")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const studyForm =
    document.getElementById("studyForm");

const subjectInput =
    document.getElementById("subject");

const topicInput =
    document.getElementById("topic");

const difficultyInput =
    document.getElementById("difficulty");

const statusInput =
    document.getElementById("status");

const targetDateInput =
    document.getElementById("targetDate");

const searchInput =
    document.getElementById("searchInput");

const subjectFilter =
    document.getElementById("subjectFilter");

const statusFilter =
    document.getElementById("statusFilter");

const difficultyFilter =
    document.getElementById("difficultyFilter");

const topicsContainer =
    document.getElementById("topicsContainer");


// ==========================================
// ADD TOPIC
// ==========================================

studyForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const subject =
            subjectInput.value.trim();

        const topic =
            topicInput.value.trim();

        const difficulty =
            difficultyInput.value;

        const status =
            statusInput.value;

        const targetDate =
            targetDateInput.value;


        if (
            subject === "" ||
            topic === "" ||
            targetDate === ""
        ) {

            alert(
                "Please fill in all fields."
            );

            return;

        }


        const newTopic = {

            id: Date.now(),

            subject: subject,

            topic: topic,

            difficulty: difficulty,

            status: status,

            targetDate: targetDate

        };


        topics.unshift(newTopic);


        saveTopics();

        studyForm.reset();

        displayTopics();

    }
);


// ==========================================
// SAVE TOPICS
// ==========================================

function saveTopics() {

    localStorage.setItem(
        "smartStudyTopics",
        JSON.stringify(topics)
    );

}


// ==========================================
// DISPLAY TOPICS
// ==========================================

function displayTopics() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedSubject =
        subjectFilter.value;

    const selectedStatus =
        statusFilter.value;

    const selectedDifficulty =
        difficultyFilter.value;


    updateSubjectFilter();


    const filteredTopics =
        topics.filter(
            item => {

                const matchesSearch =
                    item.subject
                        .toLowerCase()
                        .includes(search) ||
                    item.topic
                        .toLowerCase()
                        .includes(search);


                const matchesSubject =
                    selectedSubject === "All" ||
                    item.subject === selectedSubject;


                const matchesStatus =
                    selectedStatus === "All" ||
                    item.status === selectedStatus;


                const matchesDifficulty =
                    selectedDifficulty === "All" ||
                    item.difficulty === selectedDifficulty;


                return (
                    matchesSearch &&
                    matchesSubject &&
                    matchesStatus &&
                    matchesDifficulty
                );

            }
        );


    topicsContainer.innerHTML = "";


    if (
        filteredTopics.length === 0
    ) {

        topicsContainer.innerHTML = `

            <div class="empty-message">

                <h3>
                    No study topics found
                </h3>

                <p>
                    Add your first topic to start studying.
                </p>

            </div>

        `;

        updateDashboard();

        return;

    }


    filteredTopics.forEach(
        item => {

            const card =
                document.createElement("div");

            card.className =
                "topic-card";


            const difficultyClass =
                item.difficulty
                    .toLowerCase();


            const statusClass =
                item.status
                    .toLowerCase()
                    .replace(" ", "-");


            card.innerHTML = `

                <h3>
                    ${escapeHTML(item.topic)}
                </h3>

                <p class="subject-name">
                    ${escapeHTML(item.subject)}
                </p>


                <div class="badges">

                    <span class="badge ${difficultyClass}">
                        ${item.difficulty}
                    </span>

                    <span class="badge ${statusClass}">
                        ${item.status}
                    </span>

                </div>


                <p class="target-date">
                    Target:
                    ${formatDate(item.targetDate)}
                </p>


                <div class="card-actions">

                    <button
                        class="status-btn"
                        onclick="changeStatus(${item.id})"
                    >
                        Change Status
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTopic(${item.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            topicsContainer.appendChild(card);

        }
    );


    updateDashboard();

}


// ==========================================
// CHANGE STATUS
// ==========================================

function changeStatus(id) {

    const item =
        topics.find(
            topic =>
                topic.id === id
        );


    if (!item) {
        return;
    }


    if (
        item.status === "Not Started"
    ) {

        item.status =
            "In Progress";

    } else if (
        item.status === "In Progress"
    ) {

        item.status =
            "Completed";

    } else {

        item.status =
            "Not Started";

    }


    saveTopics();

    displayTopics();

}


// ==========================================
// DELETE TOPIC
// ==========================================

function deleteTopic(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this topic?"
        );


    if (!confirmDelete) {
        return;
    }


    topics =
        topics.filter(
            item =>
                item.id !== id
        );


    saveTopics();

    displayTopics();

}


// ==========================================
// SUBJECT FILTER
// ==========================================

function updateSubjectFilter() {

    const currentValue =
        subjectFilter.value;


    const subjects =
        [
            ...new Set(
                topics.map(
                    item =>
                        item.subject
                )
            )
        ]
        .sort();


    subjectFilter.innerHTML = `

        <option value="All">
            All Subjects
        </option>

    `;


    subjects.forEach(
        subject => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                subject;

            option.textContent =
                subject;

            subjectFilter.appendChild(
                option
            );

        }
    );


    if (
        subjects.includes(currentValue)
    ) {

        subjectFilter.value =
            currentValue;

    } else {

        subjectFilter.value =
            "All";

    }

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const total =
        topics.length;


    const completed =
        topics.filter(
            item =>
                item.status === "Completed"
        ).length;


    const inProgress =
        topics.filter(
            item =>
                item.status === "In Progress"
        ).length;


    const pending =
        topics.filter(
            item =>
                item.status === "Not Started"
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    document.getElementById(
        "totalTopics"
    ).innerText =
        total;


    document.getElementById(
        "completedTopics"
    ).innerText =
        completed;


    document.getElementById(
        "progressTopics"
    ).innerText =
        inProgress;


    document.getElementById(
        "pendingTopics"
    ).innerText =
        pending;


    document.getElementById(
        "progressPercentage"
    ).innerText =
        percentage + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    const dateObject =
        new Date(
            date + "T00:00:00"
        );


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// SEARCH & FILTERS
// ==========================================

searchInput.addEventListener(
    "input",
    displayTopics
);

subjectFilter.addEventListener(
    "change",
    displayTopics
);

statusFilter.addEventListener(
    "change",
    displayTopics
);

difficultyFilter.addEventListener(
    "change",
    displayTopics
);


// ==========================================
// INITIAL LOAD
// ==========================================

displayTopics();