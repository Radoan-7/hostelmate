import React, { useState } from "react";

export default function AboutMe() {
  const [copied, setCopied] = useState(false);
  const bkashNumber = "01728712196";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bkashNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900 font-[Rubik]">
      <h2 className="text-3xl font-bold mb-6 text-center">👨‍💻 About the Developer</h2>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
        {/* Profile Image */}
        <img
          src="/images/radoan.jpeg"
          alt="Radoan"
          className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-blue-500 object-cover"
        />

        {/* Bio Text */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">MD Radoan</h3>
        <p className="text-base text-gray-700 leading-relaxed">
          I’m Radoan, a 2nd-year Computer Science & Engineering student and a passionate developer who loves solving real-world problems through tech.
          <br />
          <br />
          <strong>HostelMate</strong> is a solo-built project aimed at making life easier for hostel residents by tracking meals, managing bills, and handling shared finances. It was built using{" "}
          <span className="text-blue-600 font-medium">React</span> and{" "}
          <span className="text-blue-600 font-medium">Firebase</span>, with the help of online communities and tutorials.
        </p>

        {/* LinkedIn Button */}
        <a
          href="https://www.linkedin.com/in/md-radoan-bin-mahabubur-8862332ba/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
        >
          Connect on LinkedIn
        </a>

        <p className="text-sm text-gray-400 mt-4">Updated: 19 June 2025</p>

        {/* bKash Support Section */}
        <div className="mt-10 p-6 border border-blue-300 rounded-xl bg-blue-100 text-center shadow-md">
          <h3 className="text-2xl font-semibold mb-3 text-blue-900">☕ Support the Developer via bKash</h3>
          <p className="mb-6 text-blue-800 text-base">
            If you find <strong>HostelMate</strong> useful, I’d be grateful for your support via bKash. Even a small contribution helps me keep learning and improving. Thank you for being part of this journey.
          </p>

          <div className="flex justify-center items-center space-x-4">
            <code className="bg-white px-5 py-3 rounded-lg border font-mono text-xl select-all text-blue-900">
              {bkashNumber}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              aria-label="Copy bKash number"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
