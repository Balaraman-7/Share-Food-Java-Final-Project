const API = "http://localhost:8080";


// ======================================================
// GENERAL HELPERS
// ======================================================

async function apiRequest(url, options = {}) {

    try {

        const response = await fetch(API + url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        const text = await response.text();

        let data;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = text;
        }

        if (!response.ok) {

            let message =
                typeof data === "string"
                    ? data
                    : data?.message || "Request failed";

            throw new Error(message);
        }

        return data;

    } catch (error) {

        console.error(error);

        showToast(
            error.message || "Unable to connect to server",
            true
        );

        throw error;
    }
}


function showToast(message, error = false) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = "toast show";

    if (error) {
        toast.classList.add("error");
    }

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString();
}


function closeModal(id) {

    document.getElementById(id).classList.remove("show");
}


// ======================================================
// NAVIGATION
// ======================================================

function showSection(sectionId) {

    document.querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active-section");
        });

    document.getElementById(sectionId)
        .classList.add("active-section");


    document.querySelectorAll(".nav-link")
        .forEach(button => {
            button.classList.remove("active");
        });


    const navButton =
        [...document.querySelectorAll(".nav-link")]
            .find(button =>
                button.textContent
                    .toLowerCase()
                    .includes(
                        sectionId === "food"
                            ? "food listings"
                            : sectionId
                    )
            );

    if (navButton) {
        navButton.classList.add("active");
    }


    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "donors") {
        loadDonors();
    }

    if (sectionId === "ngos") {
        loadNgos();
    }

    if (sectionId === "food") {
        loadFood();
    }

    if (sectionId === "claims") {
        loadClaims();
    }
}


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const [
            donors,
            ngos,
            food,
            available
        ] = await Promise.all([
            apiRequest("/donors"),
            apiRequest("/ngos"),
            apiRequest("/food"),
            apiRequest("/food/available")
        ]);


        document.getElementById("statDonors")
            .textContent = donors.length;

        document.getElementById("statNgos")
            .textContent = ngos.length;

        document.getElementById("statFood")
            .textContent = food.length;

        document.getElementById("statAvailable")
            .textContent = available.length;


        document.getElementById("heroDonorCount")
            .textContent = donors.length;

        document.getElementById("heroNgoCount")
            .textContent = ngos.length;

        document.getElementById("heroFoodCount")
            .textContent = food.length;


        renderDashboardFood(available);

    } catch (error) {

        console.error("Dashboard error:", error);
    }
}


function renderDashboardFood(foodList) {

    const container =
        document.getElementById("dashboardFoodGrid");

    if (!foodList.length) {

        container.innerHTML =
            `<div class="loading">
                No available food listings.
            </div>`;

        return;
    }


    container.innerHTML =
        foodList
            .slice(0, 3)
            .map(food => createFoodCard(food, false))
            .join("");
}


// ======================================================
// DONORS
// ======================================================

async function loadDonors() {

    const tbody =
        document.getElementById("donorsTableBody");

    tbody.innerHTML =
        `<tr>
            <td colspan="6">Loading donors...</td>
        </tr>`;


    try {

        const donors =
            await apiRequest("/donors");

        renderDonors(donors);

    } catch (error) {

        tbody.innerHTML =
            `<tr>
                <td colspan="6">
                    Failed to load donors.
                </td>
            </tr>`;
    }
}


function renderDonors(donors) {

    const tbody =
        document.getElementById("donorsTableBody");


    if (!donors.length) {

        tbody.innerHTML =
            `<tr>
                <td colspan="6">
                    No donors found.
                </td>
            </tr>`;

        return;
    }


    tbody.innerHTML =
        donors.map(donor => {

            const listingCount =
                donor.foodListings
                    ? donor.foodListings.length
                    : 0;


            return `
                <tr>

                    <td>${escapeHtml(donor.id)}</td>

                    <td>
                        <strong>
                            ${escapeHtml(donor.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(donor.email)}
                    </td>

                    <td>
                        ${escapeHtml(donor.phone)}
                    </td>

                    <td>
                        ${listingCount}
                    </td>

                    <td>

                        <div class="action-group">

                            <button
                                class="small-btn"
                                onclick="editDonor(${donor.id})">
                                Edit
                            </button>

                            <button
                                class="small-btn delete-btn"
                                onclick="deleteDonor(${donor.id})">
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");
}


async function getDonorById() {

    const id =
        document.getElementById("donorSearchId").value;

    if (!id) {

        showToast("Enter a donor ID", true);

        return;
    }


    try {

        const donor =
            await apiRequest(`/donors/${id}`);

        renderDonors([donor]);

    } catch (error) {

        console.error(error);
    }
}


function openDonorModal(donor = null) {

    document.getElementById("donorModal")
        .classList.add("show");


    document.getElementById("donorModalTitle")
        .textContent =
        donor ? "Update Donor" : "Add Donor";


    document.getElementById("donorId").value =
        donor?.id || "";

    document.getElementById("donorName").value =
        donor?.name || "";

    document.getElementById("donorEmail").value =
        donor?.email || "";

    document.getElementById("donorPhone").value =
        donor?.phone || "";

    document.getElementById("donorPassword").value =
        donor?.password || "";
}


async function editDonor(id) {

    try {

        const donor =
            await apiRequest(`/donors/${id}`);

        openDonorModal(donor);

    } catch (error) {

        console.error(error);
    }
}


document.getElementById("donorForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("donorId").value;


        const donor = {

            name:
            document.getElementById("donorName").value,

            email:
            document.getElementById("donorEmail").value,

            phone:
            document.getElementById("donorPhone").value,

            password:
            document.getElementById("donorPassword").value
        };


        try {

            if (id) {

                await apiRequest(`/donors/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(donor)
                });

                showToast("Donor updated successfully");

            } else {

                await apiRequest("/donors", {
                    method: "POST",
                    body: JSON.stringify(donor)
                });

                showToast("Donor added successfully");
            }


            closeModal("donorModal");

            this.reset();

            loadDonors();

            loadDashboard();

        } catch (error) {

            console.error(error);
        }

    });


async function deleteDonor(id) {

    if (!confirm("Delete this donor?")) {
        return;
    }


    try {

        await apiRequest(`/donors/${id}`, {
            method: "DELETE"
        });

        showToast("Donor deleted successfully");

        loadDonors();

        loadDashboard();

    } catch (error) {

        console.error(error);
    }
}


// ======================================================
// NGOS
// ======================================================

async function loadNgos() {

    const tbody =
        document.getElementById("ngosTableBody");


    tbody.innerHTML =
        `<tr>
            <td colspan="6">
                Loading NGOs...
            </td>
        </tr>`;


    try {

        const ngos =
            await apiRequest("/ngos");

        renderNgos(ngos);

    } catch (error) {

        tbody.innerHTML =
            `<tr>
                <td colspan="6">
                    Failed to load NGOs.
                </td>
            </tr>`;
    }
}


function renderNgos(ngos) {

    const tbody =
        document.getElementById("ngosTableBody");


    if (!ngos.length) {

        tbody.innerHTML =
            `<tr>
                <td colspan="6">
                    No NGOs found.
                </td>
            </tr>`;

        return;
    }


    tbody.innerHTML =
        ngos.map(ngo => {

            return `
                <tr>

                    <td>${escapeHtml(ngo.id)}</td>

                    <td>
                        <strong>
                            ${escapeHtml(ngo.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(ngo.email)}
                    </td>

                    <td>
                        ${escapeHtml(ngo.phone)}
                    </td>

                    <td>
                        ${escapeHtml(ngo.address)}
                    </td>

                    <td>

                        <div class="action-group">

                            <button
                                class="small-btn"
                                onclick="editNgo(${ngo.id})">
                                Edit
                            </button>

                            <button
                                class="small-btn delete-btn"
                                onclick="deleteNgo(${ngo.id})">
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");
}


async function getNgoById() {

    const id =
        document.getElementById("ngoSearchId").value;

    if (!id) {

        showToast("Enter an NGO ID", true);

        return;
    }


    try {

        const ngo =
            await apiRequest(`/ngos/${id}`);

        renderNgos([ngo]);

    } catch (error) {

        console.error(error);
    }
}


function openNgoModal(ngo = null) {

    document.getElementById("ngoModal")
        .classList.add("show");


    document.getElementById("ngoModalTitle")
        .textContent =
        ngo ? "Update NGO" : "Add NGO";


    document.getElementById("ngoId").value =
        ngo?.id || "";

    document.getElementById("ngoName").value =
        ngo?.name || "";

    document.getElementById("ngoEmail").value =
        ngo?.email || "";

    document.getElementById("ngoPhone").value =
        ngo?.phone || "";

    document.getElementById("ngoAddress").value =
        ngo?.address || "";
}


async function editNgo(id) {

    try {

        const ngo =
            await apiRequest(`/ngos/${id}`);

        openNgoModal(ngo);

    } catch (error) {

        console.error(error);
    }
}


document.getElementById("ngoForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("ngoId").value;


        const ngo = {

            name:
            document.getElementById("ngoName").value,

            email:
            document.getElementById("ngoEmail").value,

            phone:
            document.getElementById("ngoPhone").value,

            address:
            document.getElementById("ngoAddress").value
        };


        try {

            if (id) {

                await apiRequest(`/ngos/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(ngo)
                });

                showToast("NGO updated successfully");

            } else {

                await apiRequest("/ngos", {
                    method: "POST",
                    body: JSON.stringify(ngo)
                });

                showToast("NGO added successfully");
            }


            closeModal("ngoModal");

            this.reset();

            loadNgos();

            loadDashboard();

        } catch (error) {

            console.error(error);
        }

    });


async function deleteNgo(id) {

    if (!confirm("Delete this NGO?")) {
        return;
    }


    try {

        await apiRequest(`/ngos/${id}`, {
            method: "DELETE"
        });

        showToast("NGO deleted successfully");

        loadNgos();

        loadDashboard();

    } catch (error) {

        console.error(error);
    }
}


// ======================================================
// FOOD
// ======================================================

async function loadFood() {

    const container =
        document.getElementById("foodGrid");

    container.innerHTML =
        `<div class="loading">
            Loading food listings...
        </div>`;


    try {

        const food =
            await apiRequest("/food");

        renderFood(food);

    } catch (error) {

        console.error(error);
    }
}


async function loadAvailableFood() {

    const container =
        document.getElementById("foodGrid");

    container.innerHTML =
        `<div class="loading">
            Loading available food...
        </div>`;


    try {

        const food =
            await apiRequest("/food/available");

        renderFood(food);

    } catch (error) {

        console.error(error);
    }
}


function renderFood(foodList) {

    const container =
        document.getElementById("foodGrid");


    if (!foodList.length) {

        container.innerHTML =
            `<div class="loading">
                No food listings found.
            </div>`;

        return;
    }


    container.innerHTML =
        foodList
            .map(food => createFoodCard(food, true))
            .join("");
}


function createFoodCard(food, actions = true) {

    const status =
        food.status || "AVAILABLE";


    const statusClass =
        status === "AVAILABLE"
            ? "status-available"
            : "status-claimed";


    return `
        <div class="food-card">

            <div class="food-card-top">

                <div>

                    <div class="food-id">
                        Food ID: ${escapeHtml(food.id)}
                    </div>

                    <h3>
                        ${escapeHtml(food.foodName)}
                    </h3>

                </div>

                <span class="status-badge ${statusClass}">
                    ${escapeHtml(status)}
                </span>

            </div>


            <div class="food-details">

                <div class="food-detail">
                    <span>Quantity</span>
                    <span>${escapeHtml(food.quantity)}</span>
                </div>

                <div class="food-detail">
                    <span>Type</span>
                    <span>${escapeHtml(food.type)}</span>
                </div>

                <div class="food-detail">
                    <span>Safe Until</span>
                    <span>
                        ${formatDate(food.safeToEatUntil)}
                    </span>
                </div>

            </div>


            ${
        actions
            ? `
                <div class="food-actions">

                    ${
                status === "AVAILABLE"
                    ? `
                        <button
                            class="small-btn"
                            onclick="openClaimModal(
                                ${food.id},
                                '${escapeHtml(food.foodName)}'
                            )">
                            Claim
                        </button>
                        `
                    : ""
            }


                    <button
                        class="small-btn"
                        onclick="editFood(${food.id})">
                        Edit
                    </button>


                    <button
                        class="small-btn delete-btn"
                        onclick="deleteFood(${food.id})">
                        Delete
                    </button>

                </div>
                `
            : ""
    }

        </div>
    `;
}


async function getFoodById() {

    const id =
        document.getElementById("foodSearchId").value;

    if (!id) {

        showToast("Enter a food ID", true);

        return;
    }


    try {

        const food =
            await apiRequest(`/food/${id}`);

        renderFood([food]);

    } catch (error) {

        console.error(error);
    }
}


function openFoodModal(food = null) {

    document.getElementById("foodModal")
        .classList.add("show");


    document.getElementById("foodModalTitle")
        .textContent =
        food ? "Update Food" : "Add Food";


    document.getElementById("foodId").value =
        food?.id || "";

    document.getElementById("foodName").value =
        food?.foodName || "";

    document.getElementById("foodQuantity").value =
        food?.quantity || "";

    document.getElementById("foodType").value =
        food?.type || "";

    document.getElementById("foodDonorId").value =
        food?.donor?.id || "";

    if (food?.safeToEatUntil) {

        const date =
            new Date(food.safeToEatUntil);

        const local =
            new Date(
                date.getTime() -
                date.getTimezoneOffset() * 60000
            )
                .toISOString()
                .slice(0, 16);

        document.getElementById("foodExpiry")
            .value = local;

    } else {

        document.getElementById("foodExpiry")
            .value = "";
    }
}


async function editFood(id) {

    try {

        const food =
            await apiRequest(`/food/${id}`);

        openFoodModal(food);

    } catch (error) {

        console.error(error);
    }
}


document.getElementById("foodForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("foodId").value;


        const food = {

            foodName:
            document.getElementById("foodName").value,

            quantity:
                Number(
                    document.getElementById("foodQuantity").value
                ),

            type:
            document.getElementById("foodType").value,

            safeToEatUntil:
            document.getElementById("foodExpiry").value,

            donor: {

                id:
                    Number(
                        document.getElementById("foodDonorId").value
                    )
            }
        };


        try {

            if (id) {

                await apiRequest(`/food/${id}`, {

                    method: "PUT",

                    body:
                        JSON.stringify(food)
                });

                showToast(
                    "Food listing updated successfully"
                );

            } else {

                await apiRequest("/food", {

                    method: "POST",

                    body:
                        JSON.stringify(food)
                });

                showToast(
                    "Food listing added successfully"
                );
            }


            closeModal("foodModal");

            this.reset();

            loadFood();

            loadDashboard();

        } catch (error) {

            console.error(error);
        }

    });


async function deleteFood(id) {

    if (!confirm("Delete this food listing?")) {
        return;
    }


    try {

        await apiRequest(`/food/${id}`, {
            method: "DELETE"
        });

        showToast(
            "Food listing deleted successfully"
        );

        loadFood();

        loadDashboard();

    } catch (error) {

        console.error(error);
    }
}


// ======================================================
// CLAIMS
// ======================================================

async function openClaimModal(foodId, foodName) {

    document.getElementById("claimModal")
        .classList.add("show");


    document.getElementById("claimFoodId")
        .value = foodId;


    document.getElementById("claimFoodIdDisplay")
        .textContent = foodId;


    document.getElementById("claimFoodNameDisplay")
        .textContent = foodName;


    await loadNgoDropdown();
}


async function loadNgoDropdown() {

    const select =
        document.getElementById("claimNgoId");


    select.innerHTML =
        `<option value="">
            Loading NGOs...
        </option>`;


    try {

        const ngos =
            await apiRequest("/ngos");


        if (!ngos.length) {

            select.innerHTML =
                `<option value="">
                    No NGOs available
                </option>`;

            return;
        }


        select.innerHTML =
            `<option value="">
                Select NGO
            </option>`;


        ngos.forEach(ngo => {

            const option =
                document.createElement("option");

            option.value = ngo.id;

            option.textContent =
                `${ngo.name} (ID: ${ngo.id})`;

            select.appendChild(option);

        });

    } catch (error) {

        select.innerHTML =
            `<option value="">
                Failed to load NGOs
            </option>`;
    }
}


document.getElementById("claimForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const foodId =
            document.getElementById("claimFoodId").value;

        const ngoId =
            document.getElementById("claimNgoId").value;


        if (!foodId || !ngoId) {

            showToast(
                "Select an NGO before claiming",
                true
            );

            return;
        }


        try {

            await apiRequest(
                `/claims/food/${foodId}/ngo/${ngoId}`,
                {
                    method: "POST"
                }
            );


            showToast(
                "Food claimed successfully"
            );


            closeModal("claimModal");


            loadFood();

            loadDashboard();

            loadClaims();

        } catch (error) {

            console.error(error);
        }

    });


async function loadClaims() {

    const tbody =
        document.getElementById("claimsTableBody");


    tbody.innerHTML =
        `<tr>
            <td colspan="8">
                Loading claims...
            </td>
        </tr>`;


    try {

        /*
         * Assumes your ClaimController has:
         *
         * GET /claims
         *
         * returning all claims.
         */

        const claims =
            await apiRequest("/claims");


        renderClaims(claims);

    } catch (error) {

        tbody.innerHTML =
            `<tr>
                <td colspan="8">
                    Unable to load claims.
                    Check your ClaimController endpoint.
                </td>
            </tr>`;
    }
}


function renderClaims(claims) {

    const tbody =
        document.getElementById("claimsTableBody");


    if (!claims.length) {

        tbody.innerHTML =
            `<tr>
                <td colspan="8">
                    No claims found.
                </td>
            </tr>`;

        return;
    }


    tbody.innerHTML =
        claims.map(claim => {

            const food =
                claim.foodListing || {};

            const ngo =
                claim.ngo || {};


            return `
                <tr>

                    <td>
                        ${escapeHtml(claim.id)}
                    </td>

                    <td>
                        ${escapeHtml(food.foodName)}
                    </td>

                    <td>
                        ${escapeHtml(food.id)}
                    </td>

                    <td>
                        ${escapeHtml(ngo.name)}
                    </td>

                    <td>
                        ${escapeHtml(ngo.id)}
                    </td>

                    <td>
                        ${formatDate(claim.claimedAt)}
                    </td>

                    <td>

                        <span class="status-badge status-claimed">
                            ${escapeHtml(claim.status)}
                        </span>

                    </td>

                    <td>

                        <button
                            class="small-btn delete-btn"
                            onclick="deleteClaim(${claim.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        }).join("");
}


async function deleteClaim(id) {

    if (!confirm("Delete this claim?")) {
        return;
    }


    try {

        await apiRequest(`/claims/${id}`, {
            method: "DELETE"
        });


        showToast(
            "Claim deleted successfully"
        );


        loadClaims();

        loadFood();

        loadDashboard();

    } catch (error) {

        console.error(error);
    }
}


// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();

    }
);


// ======================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ======================================================

window.addEventListener("click", function(event) {

    document.querySelectorAll(".modal")
        .forEach(modal => {

            if (event.target === modal) {

                modal.classList.remove("show");
            }

        });

});