'use strict';
const templates = {
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),

  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),

  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),

  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};
{
  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* get 'href' attribute from the clicked link */
    const atributeClickedLink = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(atributeClickedLink);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const opts = {
    title: {
      selector: '.post-title',
      listSelector: '.titles',
    },

    articleSelector: '.post',
    articleTagsSelector: '.post-tags .list',
    authorSection: '.post-author',
    tagsListSelector: '.list.tags',

    cloud: {
      classCount: 5,
      classPrefix: 'tag-size-',
      authorClassPrefix: 'author-size-',
    },

    authorsListSelector: '.list.authors',
  };

  const generateTitleLinks = function (customSelector = '') {
    /* remove content from old list of links. */
    const titleList = document.querySelector(opts.title.listSelector);
    titleList.innerHTML = '';

    /* find ID for articles and save them to variables */
    const articles = document.querySelectorAll(opts.articleSelector + customSelector);

    let html = '';

    for (let article of articles) {
      const articleID = article.getAttribute('id');

      /* find element with tile and save it */
      const articleTitle = article.querySelector(opts.title.selector).innerHTML;

      /* create html code for link and save it */
      // const linkHTML = `<li><a href="#${articleID}"><span>${articleTitle}</span></a></li>`;

      const linkHTMLData = { id: articleID, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      /* put created html code into html variable */
      html += linkHTML;
    }

    /* add html variable into title list */
    titleList.insertAdjacentHTML('beforeend', html);

    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  let allAuthors = {};

  const calculateTagsParams = tags => {
    const params = { max: 0, min: 999999 };
    for (let tag in tags) {
      // console.log(`${tag} is used ${tags[tag]} times`);

      params.max = tags[tag] > params.max ? tags[tag] : params.max;

      params.min = tags[tag] < params.min ? tags[tag] : params.min;
    }
    return params;
  };

  const calculateAuthorsParams = authors => {
    const params = { max: 0, min: 999999 };
    for (let author in authors) {
      // console.log(`${author} is used ${authors[author]} times`);

      params.max = authors[author] > params.max ? authors[author] : params.max;

      params.min = authors[author] < params.min ? authors[author] : params.min;
    }
    return params;
  };

  const calculateTagClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.cloud.classCount - 1) + 1);
    return opts.cloud.classPrefix + classNumber;
  };

  const calculateAuthorClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.cloud.classCount - 1) + 1);
    return opts.cloud.authorClassPrefix + classNumber;
  };

  const generateTags = function () {
    /* find all articles */
    const articlesList = document.querySelectorAll('article');
    // console.log(articlesList);
    /* START LOOP: for every article: */
    for (let articleItem of articlesList) {
      /* find tags wrapper */
      let articleWrapper = articleItem.querySelector(opts.articleTagsSelector);
      // console.log(articleWrapper);
      /* make html variable with empty string */
      let stringHTML = '';
      /* get tags from data-tags attribute */
      const tagsList = articleItem.getAttribute('data-tags');
      // console.log(tagsList);
      /* split tags into array */
      const tags = tagsList.split(' ');
      // console.log(tags);
      /* START LOOP: for each tag */
      for (const tag of tags) {
        console.log();
        /* generate HTML of the link */
        // const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li> `;
        // console.log(linkHTML);

        const linkHTMLData = { id: tag };
        const linkHTML = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        stringHTML += linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      articleWrapper.insertAdjacentHTML('beforeend', stringHTML);

      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.tagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    // console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */
    // let allTagsHTML = '';
    const allTagsData = { tags: [] };

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });

      /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    // console.log(allTagsData);
  };

  generateTags();

  const tagClickHandler = function (e) {
    /* prevent default action for this event */
    e.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    // console.log(clickedElement);

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    let href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    // console.log(tag);

    /* find all tag links with class active */
    const activeLinkTags = document.querySelectorAll('a.active[href^="#tag-"]');
    // console.log(activeLinkTags);

    /* START LOOP: for each active tag link */
    for (const activeTag of activeLinkTags) {
      /* remove class active */
      activeTag.classList.remove('active');

      /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const equalTags = document.querySelectorAll(`a[href="${href}"]`);
    // console.log(equalTags);

    /* START LOOP: for each found tag link */
    equalTags.forEach(function (tag) {
      /* add class active */
      tag.classList.add('active');

      /* END LOOP: for each found tag link */
    });

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const linkTags = document.querySelectorAll('[href^="#tag-"]');

    /* START LOOP: for each link */
    linkTags.forEach(function (link) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    });
  };

  addClickListenersToTags();

  const generateAuthors = function () {
    const authors = document.querySelectorAll('article');

    for (let authorItem of authors) {
      let authorWrapper = authorItem.querySelector(opts.authorSection);
      let stringHTML = '';

      const author = authorItem.getAttribute('data-author');
      // const linkHTML = `by <a href="#author-${author}"><b>${author}</b></a> `;

      const linkHTMLData = { id: author, title: author };
      const linkHTML = templates.authorLink(linkHTMLData);

      stringHTML = stringHTML + linkHTML;
      // console.log(stringHTML);

      /* [NEW] check if this link is NOT already in allAuthors */
      if (!allAuthors[author]) {
        /* [NEW] add generated code to allAuthors array */
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }

      authorWrapper.insertAdjacentHTML('beforeend', stringHTML);
    }
    const authorsList = document.querySelector(opts.authorsListSelector);

    const authorsParams = calculateAuthorsParams(allAuthors);

    const allAuthorsData = { authors: [] };

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorClass(allAuthors[author], authorsParams),
      });
    }
    authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
    // console.log(allAuthorsData);
  };
  generateAuthors();

  const authorClickHandler = function (e) {
    e.preventDefault();

    const clickedElement = this;

    let href = clickedElement.getAttribute('href');

    const writter = href.replace('#author-', '');

    const activeLinkAuthors = document.querySelectorAll('a.active[href^="#author-"]');

    for (const activeAuthor of activeLinkAuthors) {
      activeAuthor.classList.remove('active');
    }

    const equalAuthors = document.querySelectorAll(`a[href="${href}"]`);
    console.log(equalAuthors);
    equalAuthors.forEach(function (author) {
      author.classList.add('active');
    });
    generateTitleLinks('[data-author="' + writter + '"]');
  };

  const addClickListenersToAuthors = function () {
    const linkTags = document.querySelectorAll('[href^="#author-"]');
    linkTags.forEach(function (link) {
      link.addEventListener('click', authorClickHandler);
    });
  };

  addClickListenersToAuthors();
}
