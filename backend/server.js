const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input: data must be an array" });
        }

        const invalid_entries = [];
        const duplicate_edges = [];
        const seen_edges = new Set();
        const duplicate_set = new Set();

        const adjList = {};
        const parentMap = {};
        const allNodes = new Set();

        for (let rawEdge of data) {
            if (typeof rawEdge !== 'string') {
                invalid_entries.push(rawEdge);
                continue;
            }
            const edge = rawEdge.trim();
            const match = edge.match(/^([A-Z])->([A-Z])$/);
            if (!match) {
                invalid_entries.push(edge);
                continue;
            }
            const u = match[1];
            const v = match[2];

            if (u === v) {
                invalid_entries.push(edge);
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

            // Multi-parent rule
            if (parentMap[v]) {
                continue; 
            }

            parentMap[v] = u;
            if (!adjList[u]) adjList[u] = [];
            adjList[u].push(v);

            allNodes.add(u);
            allNodes.add(v);
        }

        // Ensure all nodes are in adjList
        for (let node of allNodes) {
            if (!adjList[node]) adjList[node] = [];
        }

        const hierarchies = [];
        let total_trees = 0;
        let total_cycles = 0;
        let largest_tree_root = null;
        let max_depth = 0; // The prompt says depth = number of nodes in longest path. For a single node, depth is 1.

        const visited = new Set();

        function buildTree(node) {
            const tree = {};
            for (const child of adjList[node]) {
                tree[child] = buildTree(child);
            }
            return tree;
        }

        function getDepth(node) {
            let maxChildDepth = 0;
            for (const child of adjList[node]) {
                maxChildDepth = Math.max(maxChildDepth, getDepth(child));
            }
            return 1 + maxChildDepth;
        }

        const rootsList = Array.from(allNodes).filter(n => !parentMap[n]).sort();
        for (const root of rootsList) {
            const q = [root];
            while (q.length > 0) {
                const curr = q.pop();
                visited.add(curr);
                for (const child of adjList[curr]) {
                    q.push(child);
                }
            }

            const treeObj = {};
            treeObj[root] = buildTree(root);
            const depth = getDepth(root);

            hierarchies.push(treeObj);
            total_trees++;

            if (depth > max_depth) {
                max_depth = depth;
                largest_tree_root = root;
            } else if (depth === max_depth) {
                if (!largest_tree_root || root < largest_tree_root) {
                    largest_tree_root = root;
                }
            }
        }

        const unvisited = Array.from(allNodes).filter(n => !visited.has(n));
        for (const node of unvisited) {
            if (visited.has(node)) continue;

            let curr = node;
            const pathSeen = new Set();
            while (!pathSeen.has(curr)) {
                pathSeen.add(curr);
                curr = parentMap[curr];
            }

            const cycleNodes = [];
            let cNode = curr;
            do {
                cycleNodes.push(cNode);
                cNode = parentMap[cNode];
            } while (cNode !== curr);

            cycleNodes.sort();
            const cycleRoot = cycleNodes[0];

            const q = [...cycleNodes];
            while (q.length > 0) {
                const n = q.pop();
                visited.add(n);
                for (const child of adjList[n]) {
                    if (!visited.has(child)) {
                        q.push(child);
                    }
                }
            }

            function buildTreeSafe(n, visitedSet) {
                const tree = {};
                for (const child of adjList[n]) {
                    if (!visitedSet.has(child)) {
                        visitedSet.add(child);
                        tree[child] = buildTreeSafe(child, visitedSet);
                    }
                }
                return tree;
            }

            const treeForCycle = {};
            const cycleVisitedSet = new Set([cycleRoot]);
            for (const child of adjList[cycleRoot]) {
                if (!cycleVisitedSet.has(child)) {
                    cycleVisitedSet.add(child);
                    treeForCycle[child] = buildTreeSafe(child, cycleVisitedSet);
                }
            }

            hierarchies.push({
                root: cycleRoot,
                tree: treeForCycle,
                has_cycle: true
            });
            total_cycles++;
        }

        const summary = {
            total_trees,
            total_cycles,
            largest_tree_root
        };

        const response = {
            user_id: "antigravity_24042026",
            email_id: "antigravity@example.com",
            college_roll_number: "SRM12345678",
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
