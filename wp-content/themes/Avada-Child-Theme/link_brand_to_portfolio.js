document.addEventListener("DOMContentLoaded", function() {

const portfolioFilters = document.querySelectorAll('.fusion-filter a');

  portfolioFilters.forEach(function(link) {
    link.setAttribute('role', 'menuitem');
    link.setAttribute('aria-label', link.textContent.trim());

    if (link.getAttribute('href') === '#') {
      link.setAttribute('href', 'javascript:void(0)');
    }
  });

    let articleData_en = [
        { id: "portfolio-1-post-1344", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Aparthotel%20Adagio%20Access" },
        { id: "portfolio-1-post-1346", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Aparthotel%20Adagio%20Original" },
        { id: "portfolio-1-post-1349", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=ibis%20Budget" },
        { id: "portfolio-1-post-1350", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=ibis%20Styles" },
        { id: "portfolio-1-post-1351", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Mercure%20Hotels" },
        { id: "portfolio-1-post-1352", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=M%C3%B6venpick%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-1353", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Novotel" },
        { id: "portfolio-1-post-1354", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Pullman%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-1362", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Aedenlife" },
        { id: "portfolio-1-post-1364", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Amedia%20Hotels%20%26%20Suites" },
        { id: "portfolio-1-post-1366", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1368", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Dorint%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-1370", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1372", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hilton%20Garden%20Inn" },
        { id: "portfolio-1-post-1374", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Holiday%20Inn" },
        { id: "portfolio-1-post-1376", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Holiday%20Inn%20Express" },
        { id: "portfolio-1-post-1378", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hotel%20Schloss%20Neustadt-Glewe" },
        { id: "portfolio-1-post-1380", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hyatt%20House" },
        { id: "portfolio-1-post-1382", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Revo" },
        { id: "portfolio-1-post-1384", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=IntercityHotel" },
        { id: "portfolio-1-post-1386", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hotel%20Markgraf%20Leipzig" },
        { id: "portfolio-1-post-1388", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hotel%20des%20Nordens" },
        { id: "portfolio-1-post-1390", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1392", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Portals%20Hills" },
        { id: "portfolio-1-post-1394", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Radisson%20Individuals" },
        { id: "portfolio-1-post-1396", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Ramada%20by%20Wyndham" },
        { id: "portfolio-1-post-1398", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1400", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Revo" },
        { id: "portfolio-1-post-1402", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Seepark%20Thun%20Congress%20Hotel" },
        { id: "portfolio-1-post-1418", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Sheraton" },
        { id: "portfolio-1-post-1420", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Steigenberger%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-1422", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Strandhotel%20Sylt" },
        { id: "portfolio-1-post-1424", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Vienna%20House%20by%20Wyndham" },
        { id: "portfolio-1-post-1426", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Vienna%20House%20Easy%20by%20Wyndham" },
        { id: "portfolio-1-post-1428", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Vagabond%20Club" },
        { id: "portfolio-1-post-4105", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H2%20Hotels" },
        { id: "portfolio-1-post-4107", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H.ostels" },
        { id: "portfolio-1-post-4109", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H.omes" },
        { id: "portfolio-1-post-4111", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H4%20Hotels" },
        { id: "portfolio-1-post-4113", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H%2B%20Hotels" },
        { id: "portfolio-1-post-4115", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=HYPERION" },
        { id: "portfolio-1-post-4101", url: "https://revo-hospitality-group.com/portfolio/hotels/?city=Davos" },
        { id: "portfolio-1-post-4117", url: "https://revo-hospitality-group.com/portfolio/hotels/?parent_brand=H%20World%20International&brand=Steigenberger%20Hotels%20%26%20Resorts&city=Davos" },
        { id: "portfolio-1-post-4181", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Dorint" }
    ];

     let articleData_de = [
        { id: "portfolio-1-post-5399", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Aparthotel%20Adagio%20Access" },
        { id: "portfolio-1-post-5398", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Aparthotel%20Adagio%20Original" },
        { id: "portfolio-1-post-5397", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=ibis%20Budget" },
        { id: "portfolio-1-post-5396", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=ibis%20Styles" },
        { id: "portfolio-1-post-5395", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Mercure%20Hotels" },
        { id: "portfolio-1-post-5394", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=M%C3%B6venpick%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-5393", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Novotel" },
        { id: "portfolio-1-post-5392", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Pullman%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-5391", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Aedenlife" },
        { id: "portfolio-1-post-5390", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Amedia%20Hotels%20%26%20Suites" },

        
        { id: "portfolio-1-post-1366", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1368", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Dorint%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-1370", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1372", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hilton%20Garden%20Inn" },
        { id: "portfolio-1-post-1374", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Holiday%20Inn" },
        { id: "portfolio-1-post-1376", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Holiday%20Inn%20Express" },
        { id: "portfolio-1-post-1378", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hotel%20Schloss%20Neustadt-Glewe" },
        { id: "portfolio-1-post-1380", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hyatt%20House" },
        { id: "portfolio-1-post-1382", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Revo" },
        { id: "portfolio-1-post-1384", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=IntercityHotel" },
        { id: "portfolio-1-post-1386", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hotel%20Markgraf%20Leipzig" },
        { id: "portfolio-1-post-1388", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Hotel%20des%20Nordens" },
        { id: "portfolio-1-post-1390", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1392", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Portals%20Hills" },
        { id: "portfolio-1-post-1394", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Radisson%20Individuals" },
        { id: "portfolio-1-post-1396", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Ramada%20by%20Wyndham" },
        { id: "portfolio-1-post-1398", url: "https://revo-hospitality-group.com/portfolio/hotels/" },
        { id: "portfolio-1-post-1400", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Revo" },
        { id: "portfolio-1-post-1402", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Seepark%20Thun%20Congress%20Hotel" },
        { id: "portfolio-1-post-1418", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Sheraton" },
        { id: "portfolio-1-post-1420", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Steigenberger%20Hotels%20%26%20Resorts" },
        { id: "portfolio-1-post-1422", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Strandhotel%20Sylt" },
        { id: "portfolio-1-post-1424", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Vienna%20House%20by%20Wyndham" },
        { id: "portfolio-1-post-1426", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Vienna%20House%20Easy%20by%20Wyndham" },
        { id: "portfolio-1-post-1428", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Vagabond%20Club" },
        { id: "portfolio-1-post-4105", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H2%20Hotels" },
        { id: "portfolio-1-post-4107", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H.ostels" },
        { id: "portfolio-1-post-4109", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H.omes" },
        { id: "portfolio-1-post-4111", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H4%20Hotels" },
        { id: "portfolio-1-post-4113", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=H%2B%20Hotels" },
        { id: "portfolio-1-post-4115", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=HYPERION" },
        { id: "portfolio-1-post-4101", url: "https://revo-hospitality-group.com/portfolio/hotels/?city=Davos" },
        { id: "portfolio-1-post-4117", url: "https://revo-hospitality-group.com/portfolio/hotels/?parent_brand=H%20World%20International&brand=Steigenberger%20Hotels%20%26%20Resorts&city=Davos" },
        { id: "portfolio-1-post-4181", url: "https://revo-hospitality-group.com/portfolio/hotels/?brand=Dorint" }
    ];

    

    articleData.forEach(article => {
        let articleElement = document.getElementById(article.id);
        if (articleElement) {
            // Selektiere das erste <a>-Tag im Artikel (Bild-Link)
            let imageLink = articleElement.querySelector(".fusion-image-wrapper a");
            if (imageLink) {
                imageLink.href = article.url + "#scroll-link"; // Füge Scroll-Link hinzu
            }

            // Selektiere das zweite <a>-Tag im Artikel (Titel-Link)
            let titleLink = articleElement.querySelector(".entry-title a");
            if (titleLink) {
                titleLink.href = article.url + "#scroll-link"; // Füge Scroll-Link hinzu
            }
        }
    });
});