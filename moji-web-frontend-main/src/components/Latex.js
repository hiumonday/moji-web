/* @flow */
/* eslint-disable import/no-unresolved */

import katex from "katex";
// Eslint doesn't like react being in peerDependencies
import React from "react"; //eslint-disable-line
import PropTypes from "prop-types";

const latexify = (string, options) => {
    // Existing regular expressions for LaTeX
    const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\\]*(?:\\.[^\$\\]*)*\$/g;
    const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

    // New regular expression for underline
    const underlineRegularExpression = /#[^#]+#/g;

    // Existing functions for LaTeX
    const stripDollars = (stringToStrip) =>
        (stringToStrip[0] === "$" && stringToStrip[1] !== "$"
            ? stringToStrip.slice(1, -1)
            : stringToStrip.slice(2, -2));
    const getDisplay = (stringToDisplay) =>
        (stringToDisplay.match(blockRegularExpression) ? "block" : "inline");

    // New function for underline
    const stripHashes = (stringToStrip) => stringToStrip.slice(1, -1);

    const renderLatexString = (s, t) => {
        let renderedString;
        try {
            // returns HTML markup
            renderedString = katex.renderToString(
                s,
                t === "block" ? Object.assign({ displayMode: true }, options) : options
            );
        } catch (err) {
            console.error("couldn`t convert string", s);
            return s;
        }
        return renderedString;
    };

    const result = [];

    // Existing processing for LaTeX
    const latexMatch = string.match(regularExpression);
    const stringWithoutLatex = string.split(regularExpression);

    // New processing for underline
    const underlineMatch = string.match(underlineRegularExpression);
    const stringWithoutUnderline = string.split(underlineRegularExpression);

    // Process LaTeX matches
    // Process LaTeX matches
    if (latexMatch) {
        stringWithoutLatex.forEach((s, index) => {
            const underlineMatchInLatex = s.match(underlineRegularExpression);
            const stringWithoutUnderlineInLatex = s.split(underlineRegularExpression);
            stringWithoutUnderlineInLatex.forEach((s2, index2) => {
                result.push({
                    string: s2,
                    type: "text",
                });
                if (underlineMatchInLatex && underlineMatchInLatex[index2]) {
                    result.push({
                        string: stripHashes(underlineMatchInLatex[index2]),
                        type: "underline",
                    });
                }
            });
            if (latexMatch[index]) {
                result.push({
                    string: stripDollars(latexMatch[index]),
                    type: getDisplay(latexMatch[index]),
                });
            }
        });
    } else if (underlineMatch) { // Process underline matches when there are no LaTeX matches
        stringWithoutUnderline.forEach((s, index) => {
            result.push({
                string: s,
                type: "text",
            });
            if (underlineMatch[index]) {
                result.push({
                    string: stripHashes(underlineMatch[index]),
                    type: "underline",
                });
            }
        });
    }

    // If there are no matches, just push the whole string
    if (!latexMatch && !underlineMatch) {
        result.push({
            string,
            type: "text",
        });
    }
    const processResult = (resultToProcess) => {
        const newResult = resultToProcess.map((r) => {
            if (r.type === "text") {
                return r.string;
            } else if (r.type === "underline") {
                return <span style={{ textDecoration: 'underline', userSelect: 'none' }}>{r.string}</span>;
            }
            return (<span dangerouslySetInnerHTML={{__html: renderLatexString(r.string, r.type)}} />);
        });

        return newResult;
    };

    // Returns list of spans with latex and non-latex strings.
    return processResult(result);
};
class Latex extends React.Component {
    static propTypes = {
        children: PropTypes.string,
        displayMode: PropTypes.bool,
        leqno: PropTypes.bool,
        fleqn: PropTypes.bool,
        throwOnError: PropTypes.bool,
        errorColor: PropTypes.string,
        macros: PropTypes.object,
        minRuleThickness: PropTypes.number,
        colorIsTextColor: PropTypes.bool,
        maxSize: PropTypes.number,
        maxExpand: PropTypes.number,
        strict: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.func]),
        trust: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    };

    static defaultProps = {
        children: "",
        displayMode: false,
        output: "htmlAndMathml",
        leqno: false,
        fleqn: false,
        throwOnError: true,
        errorColor: "#cc0000",
        macros: {},
        minRuleThickness: 0,
        colorIsTextColor: false,
        strict: "warn",
        trust: false,
    };

    render() {
        const {
            children,
            displayMode,
            leqno,
            fleqn,
            throwOnError,
            errorColor,
            macros,
            minRuleThickness,
            colorIsTextColor,
            maxSize,
            maxExpand,
            strict,
            trust,
        } = this.props;

        const renderUs = latexify( children, {displayMode,
            leqno,
            fleqn,
            throwOnError,
            errorColor,
            macros,
            minRuleThickness,
            colorIsTextColor,
            maxSize,
            maxExpand,
            strict,
            trust} );
        renderUs.unshift(null);
        renderUs.unshift('span'); //put everything in a span
        // spread renderUs out to children args
        return React.createElement.apply(null, renderUs)        
    }
}

// if (module && module.exports) {
//     module.exports = Latex;
// } else {
//     window.Latex = Latex;
// }

export default Latex;