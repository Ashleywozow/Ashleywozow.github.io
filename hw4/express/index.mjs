import express from 'express';
import fetch from 'node-fetch';
import { faker } from "@faker-js/faker";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    currentPage: "overview"
  });
});

app.get("/phases", (req, res) => {
  res.render("phases", {
    currentPage: "phases"
  });
});

app.get("/models", (req, res) => {
  res.render("models", {
    currentPage: "models"
  });
});

app.get("/benefits", (req, res) => {
  res.render("benefits", {
    currentPage: "benefits"
  });
});

//Simulator Page

//Helper Functions
function getRecommendedModel(requirements) {
  if (requirements === "Stable and clearly defined") {
    return "Waterfall";
  } else if (requirements === "Strict testing and validation") {
    return "V-Model";
  } else if (requirements === "Unclear and expected to evolve") {
    return "Iterative";
  } else if (requirements === "Can be divided into separate features") {
    return "Incremental";
  } else if (requirements === "High-risk or experimental") {
    return "Spiral";
  } else {
    return "Agile";
  }
}

function getRiskLevel(requirements) {
  if (
    requirements === "High-risk or experimental" ||
    requirements === "Strict testing and validation"
  ) {
    return "High";
  } else if (
    requirements === "Frequently changing" ||
    requirements === "Unclear and expected to evolve"
  ) {
    return "Medium";
  } else {
    return "Low";
  }
}

function getProjectPriority(requirements) {
  if (requirements === "Strict testing and validation") {
    return "Testing and quality assurance";
  } else if (requirements === "High-risk or experimental") {
    return "Risk management";
  } else if (requirements === "Frequently changing") {
    return "User feedback and flexibility";
  } else if (requirements === "Can be divided into separate features") {
    return "Delivering features in stages";
  } else if (requirements === "Unclear and expected to evolve") {
    return "Learning and refining requirements";
  } else {
    return "Following the original plan";
  }
}

function getModelExplanation(recommendedModel) {
  if (recommendedModel === "Waterfall") {
    return "Waterfall moves through each phase in order, providing clear planning, documentation, and predictable progress.";
  } else if (recommendedModel === "V-Model") {
    return "The V-Model pairs each development phase with testing, helping catch problems early and improve reliability.";
  } else if (recommendedModel === "Iterative") {
    return "Iterative development builds and improves the system in repeated cycles, allowing feedback to shape later versions.";
  } else if (recommendedModel === "Incremental") {
    return "Incremental development delivers the project in smaller working sections, providing useful features sooner.";
  } else if (recommendedModel === "Spiral") {
    return "The Spiral model repeats planning, development, and risk analysis, making it useful for complex or uncertain projects.";
  } else {
    return "Agile uses short development cycles and frequent feedback, allowing the team to adapt quickly and deliver features regularly.";
  }
}

//Helper functions for fetch call
async function getGitHubRepository(repositoryPath) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repositoryPath}`
    );

    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

app.get("/simulator", async (req, res) => {
  const project = faker.helpers.arrayElement([
    {
      name: "Campus Connect",
      repositoryTitle: "Education Management Platform",
      repositoryPath: "frappe/education"
    },
    {
      name: "Inventory Tracker",
      repositoryTitle: "ERPNext Inventory System",
      repositoryPath: "frappe/erpnext"
    },
    {
      name: "Patient Portal",
      repositoryTitle: "OpenEMR Healthcare System",
      repositoryPath: "openemr/openemr"
    },
    {
      name: "Event Planner",
      repositoryTitle: "Pretix Event Ticketing Platform",
      repositoryPath: "pretix/pretix"
    },
    {
      name: "Budget Dashboard",
      repositoryTitle: "Firefly III Budget Manager",
      repositoryPath: "firefly-iii/firefly-iii"
    },
    {
      name: "Learning Management System",
      repositoryTitle: "Moodle Learning Platform",
      repositoryPath: "moodle/moodle"
    }
  ]);

  const projectName = project.name;
  const repositoryTitle = project.repositoryTitle;
  const repository = await getGitHubRepository(project.repositoryPath);

  const projectType = faker.helpers.arrayElement([
    "Mobile Application",
    "Web Application",
    "Desktop Application"
  ]);

  const requirements = faker.helpers.arrayElement([
    "Stable and clearly defined",
    "Strict testing and validation",
    "Unclear and expected to evolve",
    "Can be divided into separate features",
    "High-risk or experimental",
    "Frequently changing"
  ]);

  const clientName = faker.company.name();

  const teamSize = faker.number.int({
    min: 4,
    max: 15
  });

  const deadline = faker.date.future().toLocaleDateString();

  const recommendedModel = getRecommendedModel(requirements);
  const riskLevel = getRiskLevel(requirements);
  const priority = getProjectPriority(requirements);
  const modelExplanation = getModelExplanation(recommendedModel);

  res.render("simulator", {
    currentPage: "simulator",
    projectName,
    projectType,
    clientName,
    teamSize,
    requirements,
    deadline,
    recommendedModel,
    riskLevel,
    priority,
    modelExplanation,
    repositoryTitle,
    repository
  });
});

//Port Information
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});