fetch("members.json")
  .then(function (data) {
    return data.json();
  })
  .then(function (post) {
    showMembers(post.memberlist);
  })
  .catch(function (error) {
    const errordiv = document.getElementById("error");
    errordiv.innerHTML = "Service is not available";
  });

function showMembers(mlist) {
  // Bind javascript to html div element with id = output
  const output = document.getElementById("output");

  // Make an output template for the member information
  // and CSS styling references. I need to use "let" and
  // not "const" since the template will change for
  // each member
  let template = ""; // Empty template

  // Iterate through memberlist(objects) and show information
  for (const member of mlist) {
    // Instead of double or single quotation i use
    // backticks (`) to embrace the template content.
    // Backticks allows me to write the codes on
    // multiple lines and include double and/or
    // single quotation without javascript becoming
    // confused.
    template = `
    <section class="member">
        <img src="${member.image}" alt="Member" class="image"> 
        <div class="names">
            ${member.firstname} ${member.lastname}
        </div>
        <div class="age">
            ${member.age}
        </div>
    </section>`;

    // Show template content in output div
    output.insertAdjacentHTML("beforeend", template);
  } // end of iteration
}
