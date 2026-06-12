// src/utils/XMLUtils.js
import * as js2xmlparser from "js2xmlparser";

/**
 * Convert JS object → XML string (safe for nested arrays/objects)
 */
export function objectToXML(obj, rootName = "root") {
  try {
    // Deep sanitize object: ensure all keys and values are strings or plain objects
    const sanitize = (input) => {
      if (Array.isArray(input)) {
        return input.map(sanitize);
      } else if (input && typeof input === "object") {
        const safeObj = {};
        for (const [k, v] of Object.entries(input)) {
          safeObj[String(k)] = sanitize(v);
        }
        return safeObj;
      } else if (input === null || input === undefined) {
        return "";
      } else {
        return String(input);
      }
    };

    const safeObj = sanitize(obj);
    return js2xmlparser.parse(rootName, safeObj);
  } catch (error) {
    console.error("XML generation error:", error);
    return "<error>Invalid XML</error>";
  }
}

/**
 * Convert XML string → JS object (browser-safe)
 */
export function xmlToObject(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length) {
      throw new Error("Invalid XML format");
    }

    function xmlNodeToObject(node) {
      if (node.children.length === 0) {
        return node.textContent;
      }

      const obj = {};
      for (const child of node.children) {
        const childObj = xmlNodeToObject(child);
        if (obj[child.nodeName]) {
          if (!Array.isArray(obj[child.nodeName])) {
            obj[child.nodeName] = [obj[child.nodeName]];
          }
          obj[child.nodeName].push(childObj);
        } else {
          obj[child.nodeName] = childObj;
        }
      }
      return obj;
    }

    const root = xmlDoc.documentElement;
    return { [root.nodeName]: xmlNodeToObject(root) };
  } catch (error) {
    console.error("Invalid XML:", error);
    return { error: "Invalid XML" };
  }
}
