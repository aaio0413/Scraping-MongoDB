// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
//   });

const handleSubmit = itemId => {
  console.log("submit!");
  // const thisId = $(this).prevUntil("button", ".comment");
  // .attr("data-id");
  const thisId = itemId;
  console.log("the submit button is clicked, the item id is: ", thisId);
  const memoText = $("#memo-input").val();
  console.log("the memo's context is: ", memoText);

  $.ajax({
    method: "POST",
    url: "/anime_lists/" + thisId,
    data: {
      body: memoText
    }
  }).then(function(result) {
    // Log the response
    console.log(result);
  });
  $("#memo-input").val("");
};
// //////##################   THIS IS TO DO
// ###########   put this function in side of for loop to be ebaled to execute plus, set the target or e.stopPrepagation()
//  ###########  to make other child elements not to fir this function!!!! and you are good to goooooo!
const pasteMemos = itemId => {
  $(".memo-context").empty();

  const thisId = itemId;
  console.log("from paste Memo", thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/anime_lists/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("comment button", data);
      console.log("comment button", data.memo);

      if (data.memo) {
        $(".memo-context").empty();
        const memoText = document.createElement("p");
        memoText.innerText = data.memo.body;

        $(".memo-context").append(memoText);
      }
    });
};

const openForm = () => {
  document.getElementById("myForm").style.display = "block";
};

const closeForm = () => {
  document.getElementById("myForm").style.display = "none";
};

$(document).ready(function() {
  let itemCount = 0;

  $("#scrape").on("click", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      console.log(data);
      alert("The scraping was success!");
    });
  });

  $("#itemList").on("click", function() {
    $.ajax({
      method: "GET",
      url: "/anime_lists"
    }).then(function(data) {
      //   // console.log("the data this ajax call get is: ", data);
      console.log("ajax called then?", data);
      //   // $("body").html(data);
      //   // location.reload();
      itemCount++;
      const arr = data.items;
      // let i = 0;
      for (i = (itemCount - 1) * 20; i < itemCount * 20 + 1; i++) {
        const item = arr[i];
        const listItem = document.createElement("LI");
        const itemContent = document.createElement("DIV");
        itemContent.setAttribute("class", "image-wrapper");
        const image = document.createElement("DIV");
        image.setAttribute("class", "image");
        image.setAttribute("style", "background-image: url(" + item.img + ")");

        const anchor = document.createElement("A");
        anchor.setAttribute("href", item.link);
        image.appendChild(anchor);
        itemContent.appendChild(image);

        const summaryWrapper = document.createElement("DIV");
        summaryWrapper.setAttribute("class", "summary-wrapper");

        const title = document.createElement("DIV");
        title.setAttribute("class", "title");
        title.innerText = item.title;
        // itemContent.append(title);

        const summary = document.createElement("DIV");
        summary.setAttribute("class", "summary");
        const summaryContext = document.createElement("p");
        summaryContext.innerText = item.newSummary;
        summary.appendChild(summaryContext);
        // itemContent.append(title);

        const commentButton = document.createElement("Button");
        commentButton.setAttribute("class", "comment");
        commentButton.setAttribute("data-id", item._id);
        commentButton.setAttribute("id", "getIt");
        commentButton.setAttribute(
          "onclick",
          `pasteMemos("${item._id}");openForm()`
        );

        commentButton.innerText = "Comment";

        // itemContent.append(commentButton);

        const commentBtnDiv = document.createElement("DIV");
        commentBtnDiv.setAttribute("class", "form-popup");
        commentBtnDiv.setAttribute("id", "myForm");

        const commentForm = document.createElement("FORM");
        // commentForm.setAttribute("action", "/action_page.php");
        commentForm.setAttribute("class", "form-container");

        const memo = document.createElement("H1");
        memo.innerText = "Memo";

        const memoContext = document.createElement("div");
        memoContext.setAttribute("class", "memo-context");
        const memoInput = document.createElement("textarea");
        memoInput.setAttribute("id", "memo-input");

        const submitBtn = document.createElement("button");
        // submitBtn.setAttribute("type", "button");
        submitBtn.setAttribute("class", "submitBtn btn");
        submitBtn.setAttribute("onclick", `handleSubmit("${item._id}")`);
        // submitBtn.setAttribute("value", "SUBMIT");
        submitBtn.innerText = "SUBMIT";

        const closeBtn = document.createElement("BUTTON");
        // closeBtn.setAttribute("type", "submit");
        closeBtn.setAttribute("class", "btn cancel");
        closeBtn.setAttribute("onclick", "closeForm()");
        closeBtn.innerText = "CLOSE";

        commentForm.appendChild(memo);
        commentForm.appendChild(memoContext);
        commentForm.appendChild(memoInput);
        commentForm.appendChild(submitBtn);
        commentForm.appendChild(closeBtn);
        commentBtnDiv.appendChild(commentForm);

        // summaryContents =
        //   title.outerHTML + summary.outerHTML + commentButton.outerHTML;

        summaryWrapper.appendChild(title);
        summaryWrapper.appendChild(summary);
        summaryWrapper.appendChild(commentButton);
        summaryWrapper.appendChild(commentBtnDiv);

        itemContent.append(summaryWrapper);

        listItem.appendChild(itemContent);
        document.getElementById("items").appendChild(listItem);

        // let openUpBtn = document.getElementsByClassName("comment");
        // console.log(openUpBtn);
        // // openUpBtn.addEventListener("click", function(e) {
        // //   console.log("this is event listener: ", e.target);
        // // });

        // $("#getIt").on("click", function(event) {
        //   // event.stopPropagation();
        //   event.preventDefault();
        //   console.log("the comment button is cliicked", this);
        //   openForm();

        //   const thisId = this.getAttribute("data-id");
        //   console.log("from paste Memo", thisId);

        //   // Now make an ajax call for the Article
        //   $.ajax({
        //     method: "GET",
        //     url: "/anime_lists/" + thisId
        //   })
        //     // With that done, add the note information to the page
        //     .then(function(data) {
        //       console.log("comment button", data);
        //       console.log("comment button", data.memo);

        //       if (data.memo) {
        //         $(".memo-context").empty();
        //         const memoText = document.createElement("p");
        //         memoText.innerText = data.memo.body;

        //         $(".memo-context").append(memoText);
        //       }
        //     });
        // });

        // $("#getIt").on("click", function(e) {
        //   const targetElement = e.currentTarget;
        //   // $(targetElement).parentNode;
        //   console.log(
        //     "target element is: ",
        //     $(targetElement).contents().prevObject
        //   );
        //   console.log("openUpBtn is", openUpBtn);
        //   if ($(targetElement).is("button.comment")) {
        //     console.log("you hit it!");
        //     openForm();
        //     $(".memo-context").empty();

        //     const thisId = itemId;
        //     console.log("from paste Memo", thisId);

        //     // Now make an ajax call for the Article
        //     $.ajax({
        //       method: "GET",
        //       url: "/anime_lists/" + thisId
        //     })
        //       // With that done, add the note information to the page
        //       .then(function(data) {
        //         console.log("comment button", data);
        //         console.log("comment button", data.memo);

        //         if (data.memo) {
        //           $(".memo-context").empty();
        //           const memoText = document.createElement("p");
        //           memoText.innerText = data.memo.body;

        //           $(".memo-context").append(memoText);
        //         }
        //       });
        //   }

        //   e.stopPropagation();
        // });
      }
    });
  });

  // $(".comment").on("click", function(event) {
  //   // event.stopPropagation();
  //   event.preventDefault();
  //   console.log("the comment button is cliicked", this);
  //   openForm();

  //   const thisId = this.getAttribute("data-id");
  //   console.log("from paste Memo", thisId);

  //   // Now make an ajax call for the Article
  //   $.ajax({
  //     method: "GET",
  //     url: "/anime_lists/" + thisId
  //   })
  //     // With that done, add the note information to the page
  //     .then(function(data) {
  //       console.log("comment button", data);
  //       console.log("comment button", data.memo);

  //       if (data.memo) {
  //         $(".memo-context").empty();
  //         const memoText = document.createElement("p");
  //         memoText.innerText = data.memo.body;

  //         $(".memo-context").append(memoText);
  //       }
  //     });
  // });

  // $(".submitBtn").on("click", function(e) {
  //   console.log("submit!");
  //   // const thisId = $(this).prevUntil("button", ".comment");
  //   // .attr("data-id");
  //   const thisId = e.target.parentElement.parentElement.parentElement.getAttribute(
  //     "data-id"
  //   );
  //   // console.log(thisId);
  //   $.ajax({
  //     method: "POST",
  //     url: "/anime_lists/" + thisId,
  //     data: {
  //       body: $("#memo-input").val()
  //     }
  //   }).then(function(data) {
  //     // Log the response
  //     console.log(data);
  //   });
  //   $("#memo-input").val("");
  // });
});
