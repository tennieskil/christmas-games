export interface MatchstickPuzzle {
    id: number;
    title: string;
    problem: string;
    problemImage: string;
    solutionImage: string;
}

export const matchstickPuzzles: MatchstickPuzzle[] = [
    {
        id: 1,
        title: "Staplade Trianglar",
        problem: "Det finns 4 lika stora trianglar. Flytta 4 tändstickor för att skapa 2 lika stora trianglar.",
        problemImage: "/puzzles/p1_problem.png",
        solutionImage: "/puzzles/p1_solution.png",
    },
    {
        id: 2,
        title: "Sex till Fem Trianglar",
        problem: "Det finns 6 lika stora trianglar. FLYTTA 2 tändstickor för att forma 5 lika stora trianglar.",
        problemImage: "/puzzles/p2_problem.png",
        solutionImage: "/puzzles/p2_solution.png",
    },
    {
        id: 3,
        title: "Kors till Kvadrater",
        problem: "Flytta 4 tändstickor för att ändra korset till 4 LIKA STORA kvadrater.",
        problemImage: "/puzzles/p3_problem.png",
        solutionImage: "/puzzles/p3_solution.png",
    },
    {
        id: 4,
        title: "4 till 3 kvadrater",
        problem: "Ta bort 3 och flytta 2 tändstickor för att forma 3 lika stora kvadrater.",
        problemImage: "/puzzles/p4_problem.png",
        solutionImage: "/puzzles/p4_solution.png",
    },
    {
        id: 5,
        title: "5 till 4 kvadrater",
        problem: "Flytta 2 tändstickor för att forma 4 lika stora kvadrater.",
        problemImage: "/puzzles/p5_problem.png",
        solutionImage: "/puzzles/p5_solution.png",
    },
];
