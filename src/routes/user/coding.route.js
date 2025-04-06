import express from "express";
import { exec } from "child_process";
import fs from "fs";

const compilerRouteManager = express.Router();
const testCases = JSON.parse(fs.readFileSync("./testcases.json", "utf-8"));


export default compilerRouteManager;
