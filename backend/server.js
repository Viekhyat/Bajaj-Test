const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

function validateInput(data) {
    const validEdges = [];
    const invalid_entries = [];
    const duplicate_edges = [];
    const seen_edges = new Set();
    const duplicate_set = new Set();

    for (let rawEdge of data) {
        if (typeof rawEdge !== 'string') {
            invalid_entries.push(rawEdge);
            continue;
        }

        let edge = rawEdge.trim();

        const match = edge.match(/^([A-Z])->([A-Z])$/);
        if (!match) {
            invalid_entries.push(rawEdge);
            continue;
        }

        const u = match[1];
        const v = match[2];

        if (u === v) {
            invalid_entries.push(rawEdge);
            continue;
        }

        if (seen_edges.has(edge)) {
            if (!duplicate_set.has(edge)) {
                duplicate_edges.push(edge);
                duplicate_set.add(edge);
            }
            continue;
        }
        seen_edges.add(edge);
        validEdges.push(edge);
    }
    return { validEdges, invalid_entries, duplicate_edges };
}

function buildGraph(validEdges) {
    const adjList = {};
    const parentMap = {};
    const allNodes = new Set();

    for (const edge of validEdges) {
        const u = edge[0];
        const v = edge[3];

        allNodes.add(u);
        allNodes.add(v);

        if (!adjList[u]) adjList[u] = [];
        if (!adjList[v]) adjList[v] = [];

        if (parentMap[v]) {
            continue;
        }
        parentMap[v] = u;
        adjList[u].push(v);
    }

    return { adjList, parentMap, allNodes };
}

function buildTree(node, adjList) {
    const tree = {};
    for (const child of adjList[node]) {
        tree[child] = buildTree(child, adjList);
    }
    return tree;
}

function calculateDepth(node, adjList) {
    let maxChildDepth = 0;
    for (const child of adjList[node]) {
        maxChildDepth = Math.max(maxChildDepth, calculateDepth(child, adjList));
    }
    return 1 + maxChildDepth;
}

function detectCyclesAndBuildHierarchies(adjList, parentMap, allNodes) {
    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_depth = 0;

    const visited = new Set();
    const recStack = new Set();

    function dfs(node, path) {
        if (recStack.has(node)) return true;
        if (visited.has(node)) return false;

        visited.add(node);
        recStack.add(node);
        path.push(node);

        let hasCycle = false;
        for (const neighbor of adjList[node]) {
            if (dfs(neighbor, path)) {
                hasCycle = true;
            }
        }

        recStack.delete(node);
        return hasCycle;
    }

    const nodes = Array.from(allNodes);
    const roots = nodes.filter(n => !parentMap[n]).sort();

    for (const root of roots) {
        const path = [];
        const hasCycle = dfs(root, path);

        if (!hasCycle) {
            const treeObj = {};
            treeObj[root] = buildTree(root, adjList);
            const depth = calculateDepth(root, adjList);

            hierarchies.push({
                root: root,
                tree: treeObj,
                depth: depth
            });
            total_trees++;

            if (depth > max_depth) {
                max_depth = depth;
                largest_tree_root = root;
            } else if (depth === max_depth) {
                if (!largest_tree_root || root < largest_tree_root) {
                    largest_tree_root = root;
                }
            }
        } else {
            hierarchies.push({
                root: root,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        }
    }

    const unvisited = nodes.filter(n => !visited.has(n));
    while (unvisited.length > 0) {
        const startNode = unvisited[0];
        const path = [];
        const cycleDetected = dfs(startNode, path);

        if (cycleDetected) {
            path.sort();
            const cycleRoot = path[0];

            hierarchies.push({
                root: cycleRoot,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        }

        for (let i = unvisited.length - 1; i >= 0; i--) {
            if (visited.has(unvisited[i])) {
                unvisited.splice(i, 1);
            }
        }
    }

    return {
        hierarchies,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input: data must be an array" });
        }

        const { validEdges, invalid_entries, duplicate_edges } = validateInput(data);
        const { adjList, parentMap, allNodes } = buildGraph(validEdges);
        const { hierarchies, summary } = detectCyclesAndBuildHierarchies(adjList, parentMap, allNodes);

        const response = {
            user_id: "Viekhyat_Khare_210322006",
            email_id: "vk8417@srmist.edu.in",
            college_roll_number: "RA2311026010062",
            hierarchies,
            invalid_entries,
            duplicate_edges,
            summary
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
