let dateInput = document.querySelector('.date'),
    btnView = document.querySelector('.view__btn'),
    toggle = document.querySelector('.dropdown-toggle'),
    leagueTogle = document.querySelector('.league_toggle'),
    leagueName,
    countryName;

// Получаем все страны
function getCountries() {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/countries',
        headers: {
            'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        response.data.response.forEach((el) => {
            $('.menu_countries').append(`
            <li class="${el.name}">
            <p>${el.name}</p><img src="${el.flag}" alt="">
        </li>
            `);
        });

        iterateCountries();
    }).catch(function (error) {
        console.error(error);
    });

}
getCountries();



function iterateCountries() {

    let listCountries = document.querySelector('.dropdown-menu'),
        listCountriesAll = listCountries.querySelectorAll('li');

    listCountriesAll.forEach((el) => {
        el.addEventListener('click', (e) => {
            toggle.innerHTML = el.classList[0];
            countryName = el.classList[0];

            getLeague(countryName);

        });
    });
}



function getLeague(country) {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
        params: { country: `${country}` },
        headers: {
            'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        // добавляем лиги в тогл для страны
        response.data.response.forEach((el) => {
            $('.list__league').append(`
            <li class="${el.league.name}">
            <p>${el.league.name}</p><img src="${el.league.logo}" alt="">
        </li>
            `);
        });

        chooseLeague(response.data.response);
    }).catch(function (error) {
        console.error(error);
    });
}

// меняем название лиги в тогле при клике
function chooseLeague(response) {
    let listLeague = document.querySelector('.list__league'),
        listLeagueAll = listLeague.querySelectorAll('li'),
        leagueId;
    listLeagueAll.forEach((el) => {
        el.addEventListener('click', () => {

            leagueTogle.innerHTML = el.classList[0] + ' ' + el.classList[1];
            leagueName = el.classList.value;
            response.forEach((el) => {
                if (leagueName == el.league.name) {
                    leagueId = el.league.id;
                }
            });
        });
    });
    btnView.addEventListener('click', () => {
        getMatches(leagueId);

    });
}





function getMatches(leagueId) {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: { date: `${dateInput.value}` },
        headers: {
            'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);

        response.data.response.forEach((el) => {
            if (el.league.id == leagueId) {
                $('.list__matches').append(`
                <div class = 'list__matches_item'>
                <p>
                <div class = 'teams'>
                <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample${el.fixture.id}" role="button" aria-expanded="false" aria-controls="collapseExample${el.fixture.id}">
                <img src = '${el.teams.home.logo}'><p>${el.teams.home.name}</p><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
              </svg></span><p>${el.teams.away.name}</p><img src = '${el.teams.away.logo}'>    
                </a>
                </div>
              </p>
              <div class="collapse" id="collapseExample${el.fixture.id}">
                <div class="card card-body${el.fixture.id}">
               
                </div>
              </div>
                </div>
            `);

                setTimeout(switchNavLink(el.fixture.id), 1000);
                setTimeout(() => {
                    infoByMatches(el.fixture.id, el.league.name, el.league.logo, el.teams.home.name, el.teams.away.name,
                        el.teams.home.logo, el.teams.away.logo, el.score.fulltime.home, el.score.fulltime.away, el.fixture.venue.name,
                        el.fixture.venue.city, el.fixture.referee, el.league.season, el.teams.home.id, el.teams.away.id, el.league.id);
                }, 1000);
            }
        });
    }).catch(function (error) {
        console.error(error);
    });
}


function switchNavLink(id) {

    $(`.card-body${id}`).append(`
    <ul class="nav nav-tabs nav__tabs${id}">
    <li class="nav-item">
      <a class="nav-link nav_link_match${id} active" aria-current="page">Матч</a>
    </li>
    <li class="nav-item">
      <a class="nav-link nav_link_tabl${id}">Таблица</a>
    </li>
    <li class="nav-item">
      <a class="nav-link nav_link_statistic${id}">Статистика</a>
    </li>
    <li class="nav-item">
      <a class="nav-link nav_link_prediction${id}">Прогноз</a>
    </li>
  </ul>

  <div class = 'tabs__container container_match${id}'></div>
  <div class = 'tabs__container container_tabl${id}'></div>
  <div class = 'tabs__container container_statistic${id}'></div>
  <div class = 'tabs__container container_prediction${id}'>прогноз</div>
    `);

    let navTabs = document.querySelector(`.nav__tabs${id}`),
        navLinkMatch = document.querySelector(`.nav_link_match${id}`),
        navLinkTabl = document.querySelector(`.nav_link_match${id}`),
        navLinkStatistic = document.querySelector(`.nav_link_match${id}`),
        navLinkPrediction = document.querySelector(`.nav_link_match${id}`),
        navLinkArray = navTabs.querySelectorAll('a');

    $(`.container_tabl${id}`).hide();
    $(`.container_statistic${id}`).hide();
    $(`.container_prediction${id}`).hide();

    navLinkArray.forEach((el) => {
        el.addEventListener('click', (e) => {
            if (e.target.innerHTML == 'Матч') {
                $(`.container_match${id}`).show();
                $(`.nav_link_match${id}`).attr('class', `nav-link nav_link_match${id} active`);
                $(`.nav_link_tabl${id}`).attr('class', `nav-link nav_link_tabl${id}`);
                $(`.nav_link_statistic${id}`).attr('class', `nav-link nav_link_statistic${id}`);
                $(`.nav_link_prediction${id}`).attr('class', `nav-link nav_link_prediction${id}`);
                $(`.container_tabl${id}`).hide();
                $(`.container_statistic${id}`).hide();
                $(`.container_prediction${id}`).hide();
            } if (e.target.innerHTML == 'Таблица') {
                $(`.container_match${id}`).hide();
                $(`.nav_link_match${id}`).attr('class', `nav-link nav_link_match${id}`);
                $(`.nav_link_tabl${id}`).attr('class', `nav-link nav_link_tabl${id} active`);
                $(`.nav_link_statistic${id}`).attr('class', `nav-link nav_link_statistic${id}`);
                $(`.nav_link_prediction${id}`).attr('class', `nav-link nav_link_prediction${id}`);
                $(`.container_tabl${id}`).show();
                $(`.container_statistic${id}`).hide();
                $(`.container_prediction${id}`).hide();
            } if (e.target.innerHTML == 'Статистика') {
                $(`.container_match${id}`).hide();
                $(`.nav_link_match${id}`).attr('class', `nav-link nav_link_match${id}`);
                $(`.nav_link_tabl${id}`).attr('class', `nav-link nav_link_tabl${id}`);
                $(`.nav_link_statistic${id}`).attr('class', `nav-link nav_link_statistic${id} active`);
                $(`.nav_link_prediction${id}`).attr('class', `nav-link nav_link_prediction${id}`);
                $(`.container_tabl${id}`).hide();
                $(`.container_statistic${id}`).show();
                $(`.container_prediction${id}`).hide();
            } if (e.target.innerHTML == 'Прогноз') {
                $(`.container_match${id}`).hide();
                $(`.nav_link_match${id}`).attr('class', `nav-link nav_link_match${id}`);
                $(`.nav_link_tabl${id}`).attr('class', `nav-link nav_link_tabl${id}`);
                $(`.nav_link_statistic${id}`).attr('class', `nav-link nav_link_statistic${id}`);
                $(`.nav_link_prediction${id}`).attr('class', `nav-link nav_link_prediction${id} active`);
                $(`.container_tabl${id}`).hide();
                $(`.container_statistic${id}`).hide();
                $(`.container_prediction${id}`).show();
            }
        });
    });

}

function infoByMatches(id, leagueName, leagueLogo, teamHome, teamAway, logoHome, logoAway, scoreHome,
    scoreAway, stadium, sity, refery, season, teamHomeId, teamAwayId, leagueID) {
    $(`.container_match${id}`).append(`
        <div class ='leagueNameAndLogo'>
            <p>${leagueName}</p><img src ='${leagueLogo}'>
        </div>
        <div class ='nameTeams'>
            <p>${teamHome}</p><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg></span><p>${teamAway}</p>
        </div>
        <div class ='logoTeams'>
            <img src ='${logoHome}'><span class ='scoreMatch'>${scoreHome} - ${scoreAway}</span><img src ='${logoAway}'>
        </div>
        <div class ='oddsFictures oddsFictures${id}'></div>
        <div class = 'predictionFictures'></div>
        <div class ='infoCityStadium'>
            <div><p class ='infoMatch'>Рефери:</p><p>${refery}</p></div>
            <div><p class ='infoMatch'>Стадион:</p><p>${stadium}</p></div>
            <div><p class ='infoMatch'>Город:</p><p>${sity}</p></div>
        </div>
    `);
    getOddsForFictures(id, teamHome, teamAway, season, teamHomeId, teamAwayId, leagueID);
}

function getOddsForFictures(id, teamHome, teamAway, season, teamHomeId, teamAwayId, leagueID) {

    // получаем коэфиенты на матч
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/odds',
        params: { fixture: `${id}` },
        headers: {
            'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        let oddsObj = response.data.response[0];
        let winerHomeOdd,
            winnerAwayOdd,
            drawOdd;

        response.data.response[0].bookmakers.forEach((el, i) => {
            if (el.name === 'Bet365') {
                el.bets.forEach((odd) => {
                    if (odd.name === 'Match Winner') {
                        odd.values.forEach((item) => {
                            if (item.value === 'Home') {
                                winerHomeOdd = item.odd;
                            }
                            if (item.value === 'Draw') {
                                drawOdd = item.odd;
                            }
                            if (item.value === 'Away') {
                                winnerAwayOdd = item.odd;
                            }
                        });
                    }
                });
            }
        });

        $(`.oddsFictures${id}`).append(`
            <div class ='oddsFicturesItem'>
            <p>П1</p><span>${winerHomeOdd}</span>
            </div>
            <div class ='oddsFicturesItem'>
            <p>X</p><span>${drawOdd}</span>
            </div>
            <div class ='oddsFicturesItem'>
            <p>П2</p><span>${winnerAwayOdd}</span>
            </div>
          `);

        getStandings(id, leagueID, season, oddsObj);

    }).catch(function (error) {
        console.error(error);
    });
}



function getStandings(id, leagueId, season, oddsObj,) {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
        params: { season: `${season}`, league: `${leagueId}` },
        headers: {
            'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);

        let standigsObj = response.data.response[0];
        $(`.container_tabl${id}`).append(`
          <h2>Турнирная таблица</h2>
          <div class ="standigs${id}">
          <div class ='standigsItem hederStandigs'>
          <span>М:</span><p>Команда:</p><span>В:</span>
          <span>Н:</span><span>П:</span>
          <h5>З/П</h5><span>О:</span>
      </div>
          </div>
      `);
        response.data.response[0].league.standings[0].forEach((el, i) => {
            $(`.standigs${id}`).append(`
                <div class ='standigsItem'>
                    <span>${i + 1}</span><p>${el.team.name}</p><span>${el.all.win}</span>
                    <span>${el.all.draw}</span><span>${el.all.lose}</span>
                    <h5>${el.all.goals.for}/${el.all.goals.against}</h5><span>${el.points}</span>
                </div>
           `);
        });

        getPredictions(id, standigsObj, oddsObj);
    }).catch(function (error) {
        console.error(error);
    });
}

function getPredictions(id, standigsObj, oddsObj) {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/predictions',
        params: { fixture: `${id}` },
        headers: {
            'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        let predictionObjApi = response.data.response[0];

        $(`.container_statistic${id}`).append(`
            <h3>Сравнение команд</h3>
            <div class ="comparisonItems">
                <div>
                    <h5>Атака</h5>
                </div>
                <div class = "comparison_item">
                <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" style="width: ${response.data.response[0].comparison.att.home}" aria-valuenow="${response.data.response[0].comparison.att.home}" aria-valuemin="0" aria-valuemax="100">${response.data.response[0].comparison.att.home}</div>
                <div class="progress-bar bg-info" role="progressbar" style="width: ${response.data.response[0].comparison.att.away}" aria-valuenow="${response.data.response[0].comparison.att.away}" aria-valuemin="0" aria-valuemax="100">${response.data.response[0].comparison.att.away}</div>
              </div>
                </div>
                <div>
                <h5>Защита</h5>
            </div>
            <div class = "comparison_item">
            <div class="progress">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${response.data.response[0].comparison.def.home}" aria-valuenow="${response.data.response[0].comparison.def.home}" aria-valuemin="0" aria-valuemax="100">${response.data.response[0].comparison.def.home}</div>
            <div class="progress-bar bg-info" role="progressbar" style="width: ${response.data.response[0].comparison.def.away}" aria-valuenow="${response.data.response[0].comparison.def.away}" aria-valuemin="0" aria-valuemax="100">${response.data.response[0].comparison.def.away}</div>
          </div>
            </div>
            <div>
            <h5>Форма</h5>
        </div>
        <div class = "comparison_item">
        <div class="progress">
        <div class="progress-bar bg-success" role="progressbar" style="width: ${response.data.response[0].comparison.form.home}" aria-valuenow="${response.data.response[0].comparison.form.home}" aria-valuemin="0" aria-valuemax="100">${response.data.response[0].comparison.form.home}</div>
        <div class="progress-bar bg-info" role="progressbar" style="width: ${response.data.response[0].comparison.form.away}" aria-valuenow="${response.data.response[0].comparison.form.away}" aria-valuemin="0" aria-valuemax="100">${response.data.response[0].comparison.form.away}</div>
      </div>
        </div>
            </div>
            <h3>Статистика</h3>
            <div class = "statistic_items">
                <div class = "statistic_item">
                    <p></p><p>${response.data.response[0].teams.home.name} <img src = "${response.data.response[0].teams.home.logo}" class = "logo"></p><p>${response.data.response[0].teams.away.name} <img src = "${response.data.response[0].teams.away.logo}" class = "logo"></p>
                </div>
                <div class = "statistic_item">
                    <p>Победы</p><p>${response.data.response[0].teams.home.league.fixtures.wins.total}</p><p>${response.data.response[0].teams.away.league.fixtures.wins.total}</p>
                </div>
                <div class = "statistic_item">
                <p>Поражения</p><p>${response.data.response[0].teams.home.league.fixtures.loses.total}</p><p>${response.data.response[0].teams.away.league.fixtures.loses.total}</p>
            </div>
            <div class = "statistic_item">
                <p>Ничьи</p><p>${response.data.response[0].teams.home.league.fixtures.draws.total}</p><p>${response.data.response[0].teams.away.league.fixtures.draws.total}</p>
            </div>
            <div class = "statistic_item">
            <p>Ср. кол-во забитых голов</p><p>${response.data.response[0].teams.home.league.goals.for.average.total}</p><p>${response.data.response[0].teams.away.league.goals.for.average.total}</p>
        </div>
        <div class = "statistic_item">
            <p>Ср. кол-во пропущеных голов</p><p>${response.data.response[0].teams.home.league.goals.against.average.total}</p><p>${response.data.response[0].teams.away.league.goals.against.average.total}</p>
        </div>
            </div>
          `);

          getLast90Fixtures(id, predictionObjApi, standigsObj, oddsObj);

    }).catch(function (error) {
        console.error(error);
    });
}

function getLast90Fixtures(id, predictionObjApi, standigsObj, oddsObj) {

    let lastFixturesHome = null,
        lastFixturesAway = null;

    function getLastFixturesByHome(teamId) {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { last: '90', team: `${teamId}` },
            headers: {
                'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            lastFixturesHome = response.data.response;
        }).catch(function (error) {
            console.error(error);
        });
    }
    getLastFixturesByHome(predictionObjApi.teams.home.id);

    function getLastFixturesByAway(teamId) {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { last: '90', team: `${teamId}` },
            headers: {
                'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            lastFixturesAway = response.data.response;
        }).catch(function (error) {
            console.error(error);
        });
    }
    getLastFixturesByAway(predictionObjApi.teams.away.id);

    setTimeout(() => {
        addPrediction(id, predictionObjApi, standigsObj, oddsObj, lastFixturesHome, lastFixturesAway, predictionObjApi.teams.home.id,
            predictionObjApi.teams.away.id);
    }, 2000);
}






// делаем прогноз
function addPrediction(id, predictionObjApi, standigsObj, oddsObj, lastFixturesHome, lastFixturesAway, homeId, awayId) {

    // Создаем обьект дынных о ставках 
    let matchOutcomes = {
        P1: { quantity: 0, odd: null, poison: null, },
        X: { quantity: 0, odd: null, poison: null, },
        P2: { quantity: 0, odd: null, poison: null, },
        X1: { quantity: 0, odd: null, poison: null, },
        X2: { quantity: 0, odd: null, poison: null, },
        f10: { quantity: 0, odd: null, poison: null, },
        f20: { quantity: 0, odd: null, poison: null, },
        f1_1: { quantity: 0, odd: null, poison: null, },
        f2_1: { quantity: 0, odd: null, poison: null, },
        f1_15: { quantity: 0, odd: null, poison: null, },
        f2_15: { quantity: 0, odd: null, poison: null, },
        f1Plus1: { quantity: 0, odd: null, poison: null, },
        f2Plus1: { quantity: 0, odd: null, poison: null, },
        f1Plus15: { quantity: 0, odd: null, poison: null, },
        f2Plus15: { quantity: 0, odd: null, poison: null, },
        tb15: { quantity: 0, odd: null, poison: null, },
        tm15: { quantity: 0, odd: null, poison: null, },
        tb2: { quantity: 0, odd: null, poison: null, },
        tm2: { quantity: 0, odd: null, poison: null, },
        tb25: { quantity: 0, odd: null, poison: null, },
        tm25: { quantity: 0, odd: null, poison: null, },
        tb3: { quantity: 0, odd: null, poison: null, },
        tm3: { quantity: 0, odd: null, poison: null, },
        tb35: { quantity: 0, odd: null, poison: null, },
        tm35: { quantity: 0, odd: null, poison: null, },
        tb4: { quantity: 0, odd: null, poison: null, },
        tm4: { quantity: 0, odd: null, poison: null, },
        It1b1: { quantity: 0, odd: null, poison: null, },
        It1m1: { quantity: 0, odd: null, poison: null, },
        It2b1: { quantity: 0, odd: null, poison: null, },
        It2m1: { quantity: 0, odd: null, poison: null, },
        It1b15: { quantity: 0, odd: null, poison: null, },
        It1m15: { quantity: 0, odd: null, poison: null, },
        It2b15: { quantity: 0, odd: null, poison: null, },
        It2m15: { quantity: 0, odd: null, poison: null, },
        OzYes: { quantity: 0, odd: null, poison: null, },
        OzNot: { quantity: 0, odd: null, poison: null, },
    };

    let teamInfo = {
        home: {
            goalkeeper: {
                rating: [],
            },
            deffender: {
                rating: [],
            },
            mildFielder: {
                rating: [],
            },
            forvard: {
                rating: [],
            },
            generalRating: null,
            statistics: {
                shotsOnGoal: [],
                shotsOffGoal: [],
                totalShots: [],
                blockedShots: [],
                shotsInsidebox: [],
                shotsOutsidebox: [],
                fouls: [],
                cornerKicks: [],
                offsides: [],
                ballPossession: [],
                yellowCards: [],
                redCards: [],
                goalkeeperSaves: [],
                totalPasses: [],
                passesAccurate: [],
                passesPercent: [],
                
            },

        },
        away: {
            goalkeeper: {
                rating: [],
            },
            deffender: {
                rating: [],
            },
            mildFielder: {
                rating: [],
            },
            forvard: {
                rating: [],
            },
            generalRating: null,
            statistics: {
                shotsOnGoal: [],
                shotsOffGoal: [],
                totalShots: [],
                blockedShots: [],
                shotsInsidebox: [],
                shotsOutsidebox: [],
                fouls: [],
                cornerKicks: [],
                offsides: [],
                ballPossession: [],
                yellowCards: [],
                redCards: [],
                goalkeeperSaves: [],
                totalPasses: [],
                passesAccurate: [],
                passesPercent: [],
            },
        },
        vsHome: {
            goalkeeper: {
                rating: [],
            },
            deffender: {
                rating: [],
            },
            mildFielder: {
                rating: [],
            },
            forvard: {
                rating: [],
            },
            generalRating: null,
            statistics: {
                shotsOnGoal: [],
                shotsOffGoal: [],
                totalShots: [],
                blockedShots: [],
                shotsInsidebox: [],
                shotsOutsidebox: [],
                fouls: [],
                cornerKicks: [],
                offsides: [],
                ballPossession: [],
                yellowCards: [],
                redCards: [],
                goalkeeperSaves: [],
                totalPasses: [],
                passesAccurate: [],
                passesPercent: [],
            },
        },
        vsAway: {
            goalkeeper: {
                rating: [],
            },
            deffender: {
                rating: [],
            },
            mildFielder: {
                rating: [],
            },
            forvard: {
                rating: [],
            },
            generalRating: null,
            statistics: {
                shotsOnGoal: [],
                shotsOffGoal: [],
                totalShots: [],
                blockedShots: [],
                shotsInsidebox: [],
                shotsOutsidebox: [],
                fouls: [],
                cornerKicks: [],
                offsides: [],
                ballPossession: [],
                yellowCards: [],
                redCards: [],
                goalkeeperSaves: [],
                totalPasses: [],
                passesAccurate: [],
                passesPercent: [],
            },
        }
    };


    // перебираем последние 90 матчей домашней команды
    function iterateLast90MatchesForHome() {
        let arrGoals = [];
        lastFixturesHome.forEach((el) => {
            arrGoals.push({ home: el.goals.home, away: el.goals.away });
        });
        // тоталы и обе забьют
        arrGoals.forEach((el) => {
            if (el.home && el.away > 0) {
                matchOutcomes.OzYes.quantity++;
            }
            if (el.home && el.away < 1 || el.home >= 1 && el.away < 1 || el.home < 1 && el.away >= 1) {
                matchOutcomes.OzNot.quantity++;
            }
            if (el.home > 1 || el.away > 1) {
                matchOutcomes.tb15.quantity++;
            }
            if (el.home < 1 && el.away < 1 || el.home < 1 && el.away <= 1 || el.home <= 1 && el.away < 1) {
                matchOutcomes.tm15.quantity++;
            }
            if (el.home >= 2 || el.away >= 2 || el.home >= 1 && el.away >= 1) {
                matchOutcomes.tb2.quantity++;
            }
            if (el.home < 1 && el.away < 1 || el.home < 1 && el.away <= 1 || el.home <= 1 && el.away < 1 || el.home < 1 && el.away <= 1) {
                matchOutcomes.tm2.quantity++;
            }
            if (el.home >= 3 || el.away >= 3 || el.home >= 1 && el.away >= 2 || el.home >= 2 && el.away >= 1) {
                matchOutcomes.tb25.quantity++;
            }
            if (el.home < 3 && el.away < 1 || el.home < 1 && el.away < 3 || el.home <= 1 && el.away <= 1) {
                matchOutcomes.tm25.quantity++;
            }
            if (el.home >= 3 || el.away >= 3 || el.home >= 1 && el.away >= 2 || el.home >= 2 && el.away >= 1) {
                matchOutcomes.tb3.quantity++;
            }
            if (el.home < 3 && el.away < 1 || el.home < 1 && el.away < 3 || el.home <= 1 && el.away <= 1) {
                matchOutcomes.tm3.quantity++;
            }
            if (el.home >= 4 || el.away >= 4 || el.home >= 1 && el.away >= 3 || el.home >= 3 && el.away >= 1 || el.home >= 2 && el.away >= 2) {
                matchOutcomes.tb35.quantity++;
            }
            if (el.home < 4 && el.away < 1 || el.home < 1 && el.away < 4 || el.home < 3 && el.away == 1 || el.home == 1 && el.away < 3) {
                matchOutcomes.tm35.quantity++;
            }
            if (el.home >= 4 || el.away >= 4 || el.home >= 1 && el.away >= 3 || el.home >= 3 && el.away >= 1 || el.home >= 2 && el.away >= 2) {
                matchOutcomes.tb4.quantity++;
            }
            if (el.home < 4 && el.away < 1 || el.home < 1 && el.away < 4 || el.home < 3 && el.away == 1 || el.home == 1 && el.away < 3) {
                matchOutcomes.tm4.quantity++;
            }

        });
        // победы и ничьи
        lastFixturesHome.forEach((el) => {
            if (el.teams.home.id == homeId) {
                if (el.teams.home.winner == true) {
                    matchOutcomes.P1.quantity++;
                }
                if (el.teams.home.winner == null) {
                    matchOutcomes.X.quantity++;
                }
            }
            if (el.teams.home.id != homeId) {
                if (el.teams.away.winner == true) {
                    matchOutcomes.P1.quantity++;
                }
                if (el.teams.away.winner == null) {
                    matchOutcomes.X.quantity++;
                }
            }
            //Форы  
            if (el.teams.home.id == homeId) {
                if (el.goals.home - el.goals.away >= 1) {
                    matchOutcomes.f1_1.quantity++;
                }
                if (el.goals.home - el.goals.away > 1) {
                    matchOutcomes.f1_15.quantity++;
                }
                if (el.goals.home - el.goals.away >= 0) {
                    matchOutcomes.f10.quantity++;
                }
                if (el.goals.home - el.goals.away > -1) {
                    matchOutcomes.f1Plus1.quantity++;
                }
                if (el.goals.home - el.goals.away >= -1) {
                    matchOutcomes.f1Plus15.quantity++;
                }
            }
            if (el.teams.home.id != homeId) {
                if (el.goals.away - el.goals.home >= 1) {
                    matchOutcomes.f1_1.quantity++;
                }
                if (el.goals.away - el.goals.home > 1) {
                    matchOutcomes.f1_15.quantity++;
                }
                if (el.goals.away - el.goals.home >= 0) {
                    matchOutcomes.f10.quantity++;
                }
                if (el.goals.away - el.goals.home > -1) {
                    matchOutcomes.f1Plus1.quantity++;
                }
                if (el.goals.away - el.goals.home >= -1) {
                    matchOutcomes.f1Plus15.quantity++;
                }
            }
        });
        // индивидуальные тоталы
        lastFixturesHome.forEach((el) => {
            if (el.teams.home.id == homeId) {
                if (el.goals.home >= 1) {
                    matchOutcomes.It1b1.quantity++;
                }
                if (el.goals.home <= 1) {
                    matchOutcomes.It1m1.quantity++;
                }
                if (el.goals.home > 1) {
                    matchOutcomes.It1b15.quantity++;
                }
                if (el.goals.home <= 1) {
                    matchOutcomes.It1m15.quantity++;
                }
            }
            if (el.teams.home.id != homeId) {
                if (el.goals.away >= 1) {
                    matchOutcomes.It1b1.quantity++;
                }
                if (el.goals.away <= 1) {
                    matchOutcomes.It1m1.quantity++;
                }
                if (el.goals.away > 1) {
                    matchOutcomes.It1b15.quantity++;
                }
                if (el.goals.away <= 1) {
                    matchOutcomes.It1m15.quantity++;
                }
            }
        });
    }
    iterateLast90MatchesForHome();

    // перебираем последние 90 матчей гостевой команды
    function iterateLast90MatchesForAway() {
        let arrGoals = [];
        lastFixturesAway.forEach((el) => {
            arrGoals.push({ home: el.goals.home, away: el.goals.away });
        });
        // тоталы и обе забьют    
        arrGoals.forEach((el) => {
            if (el.home && el.away > 0) {
                matchOutcomes.OzYes.quantity++;
            }
            if (el.home && el.away < 1 || el.home >= 1 && el.away < 1 || el.home < 1 && el.away >= 1) {
                matchOutcomes.OzNot.quantity++;
            }
            if (el.home > 1 || el.away > 1) {
                matchOutcomes.tb15.quantity++;
            }
            if (el.home < 1 && el.away < 1 || el.home < 1 && el.away <= 1 || el.home <= 1 && el.away < 1) {
                matchOutcomes.tm15.quantity++;
            }
            if (el.home >= 2 || el.away >= 2 || el.home >= 1 && el.away >= 1) {
                matchOutcomes.tb2.quantity++;
            }
            if (el.home < 1 && el.away < 1 || el.home < 1 && el.away <= 1 || el.home <= 1 && el.away < 1 || el.home < 1 && el.away <= 1) {
                matchOutcomes.tm2.quantity++;
            }
            if (el.home >= 3 || el.away >= 3 || el.home >= 1 && el.away >= 2 || el.home >= 2 && el.away >= 1) {
                matchOutcomes.tb25.quantity++;
            }
            if (el.home < 3 && el.away < 1 || el.home < 1 && el.away < 3 || el.home <= 1 && el.away <= 1) {
                matchOutcomes.tm25.quantity++;
            }
            if (el.home >= 3 || el.away >= 3 || el.home >= 1 && el.away >= 2 || el.home >= 2 && el.away >= 1) {
                matchOutcomes.tb3.quantity++;
            }
            if (el.home < 3 && el.away < 1 || el.home < 1 && el.away < 3 || el.home <= 1 && el.away <= 1) {
                matchOutcomes.tm3.quantity++;
            }
            if (el.home >= 4 || el.away >= 4 || el.home >= 1 && el.away >= 3 || el.home >= 3 && el.away >= 1 || el.home >= 2 && el.away >= 2) {
                matchOutcomes.tb35.quantity++;
            }
            if (el.home < 4 && el.away < 1 || el.home < 1 && el.away < 4 || el.home < 3 && el.away == 1 || el.home == 1 && el.away < 3) {
                matchOutcomes.tm35.quantity++;
            }
            if (el.home >= 4 || el.away >= 4 || el.home >= 1 && el.away >= 3 || el.home >= 3 && el.away >= 1 || el.home >= 2 && el.away >= 2) {
                matchOutcomes.tb4.quantity++;
            }
            if (el.home < 4 && el.away < 1 || el.home < 1 && el.away < 4 || el.home < 3 && el.away == 1 || el.home == 1 && el.away < 3) {
                matchOutcomes.tm4.quantity++;
            }

        });
        // победы и ничьи
        lastFixturesAway.forEach((el) => {
            if (el.teams.away.id == awayId) {
                if (el.teams.away.winner == true) {
                    matchOutcomes.P2.quantity++;
                }
                if (el.teams.away.winner == null) {
                    matchOutcomes.X.quantity++;
                }
            }
            if (el.teams.away.id != awayId) {
                if (el.teams.home.winner == true) {
                    matchOutcomes.P2.quantity++;
                }
                if (el.teams.home.winner == null) {
                    matchOutcomes.X.quantity++;
                }
            }
            //Форы  
            if (el.teams.away.id == awayId) {
                if (el.goals.away - el.goals.home >= 1) {
                    matchOutcomes.f2_1.quantity++;
                }
                if (el.goals.away - el.goals.home > 1) {
                    matchOutcomes.f2_15.quantity++;
                }
                if (el.goals.away - el.goals.home >= 0) {
                    matchOutcomes.f20.quantity++;
                }
                if (el.goals.away - el.goals.home > -1) {
                    matchOutcomes.f2Plus1.quantity++;
                }
                if (el.goals.away - el.goals.home >= -1) {
                    matchOutcomes.f2Plus15.quantity++;
                }
            }
            if (el.teams.away.id != awayId) {
                if (el.goals.home - el.goals.away >= 1) {
                    matchOutcomes.f2_1.quantity++;
                }
                if (el.goals.home - el.goals.away > 1) {
                    matchOutcomes.f2_15.quantity++;
                }
                if (el.goals.home - el.goals.away >= 0) {
                    matchOutcomes.f20.quantity++;
                }
                if (el.goals.home - el.goals.away > -1) {
                    matchOutcomes.f2Plus1.quantity++;
                }
                if (el.goals.home - el.goals.away >= -1) {
                    matchOutcomes.f2Plus15.quantity++;
                }
            }
        });

        // индивидуальные тоталы
        lastFixturesAway.forEach((el) => {
            if (el.teams.away.id == awayId) {
                if (el.goals.away >= 1) {
                    matchOutcomes.It2b1.quantity++;
                }
                if (el.goals.away <= 1) {
                    matchOutcomes.It2m1.quantity++;
                }
                if (el.goals.away > 1) {
                    matchOutcomes.It2b15.quantity++;
                }
                if (el.goals.away <= 1) {
                    matchOutcomes.It2m15.quantity++;
                }
            }
            if (el.teams.away.id != awayId) {
                if (el.goals.home >= 1) {
                    matchOutcomes.It2b1.quantity++;
                }
                if (el.goals.home <= 1) {
                    matchOutcomes.It2m1.quantity++;
                }
                if (el.goals.home > 1) {
                    matchOutcomes.It2b15.quantity++;
                }
                if (el.goals.home <= 1) {
                    matchOutcomes.It2m15.quantity++;
                }
            }
        });

        matchOutcomes.X1.quantity = matchOutcomes.P1.quantity + matchOutcomes.X.quantity;
        matchOutcomes.X2.quantity = matchOutcomes.P2.quantity + matchOutcomes.X.quantity;
        matchOutcomes.tb15.quantity = matchOutcomes.tb15.quantity / 2;
        matchOutcomes.tm15.quantity = matchOutcomes.tm15.quantity / 2;
        matchOutcomes.tb2.quantity = matchOutcomes.tb2.quantity / 2;
        matchOutcomes.tm2.quantity = matchOutcomes.tm2.quantity / 2;
        matchOutcomes.tb25.quantity = matchOutcomes.tb25.quantity / 2;
        matchOutcomes.tm25.quantity = matchOutcomes.tm25.quantity / 2;
        matchOutcomes.tb3.quantity = matchOutcomes.tb3.quantity / 2;
        matchOutcomes.tm3.quantity = matchOutcomes.tm3.quantity / 2;
        matchOutcomes.tb35.quantity = matchOutcomes.tb35.quantity / 2;
        matchOutcomes.tm35.quantity = matchOutcomes.tm35.quantity / 2;
        matchOutcomes.tb4.quantity = matchOutcomes.tb4.quantity / 2;
        matchOutcomes.tm4.quantity = matchOutcomes.tm4.quantity / 2;


    }
    iterateLast90MatchesForAway();
    console.log(matchOutcomes);



    // Добавляем коэфиценты в обьект
    function addOddInObj() {
        for (let key in matchOutcomes) {

            oddsObj.bookmakers.forEach((el, i) => {
                if (el.name === 'Bet365') {
                    el.bets.forEach((odd) => {
                        if (odd.name === 'Match Winner') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Home' && key == 'P1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Draw' && key == 'X') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Away' && key == 'P2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                            });
                        }
                        if (odd.name === 'Goals Over/Under') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Over 1.5' && key == 'tb15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 1.5' && key == 'tm15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 2.0' && key == 'tb2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 2.0' && key == 'tm2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 2.5' && key == 'tb25') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 2.5' && key == 'tm25') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 3.0' && key == 'tb3') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 3.0' && key == 'tm3') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 3.5' && key == 'tb35') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 3.5' && key == 'tm35') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 4.0' && key == 'tb4') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 4.0' && key == 'tm4') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                            });
                        }
                        if (odd.name === 'Both Teams Score') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Yes' && key == 'OzYes') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'No' && key == 'OzNot') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                            });
                        }
                        if (odd.name === 'Double Chance') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Home/Draw' && key == 'X1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Draw/Away' && key == 'X2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                            });
                        }
                    });
                }
                if (el.name === 'Marathonbet') {
                    el.bets.forEach((odd) => {
                        if (odd.name === 'Total - Home') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Under 1' && key == 'It1m1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 1' && key == 'It1b1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 1.5' && key == 'It1m15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 1.5' && key == 'It1b15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 2.0' && key == 'It1m2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 2.0' && key == 'It1b2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                            });
                        }
                        if (odd.name === 'Total - Away') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Under 1' && key == 'It2m1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 1' && key == 'It2b1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 1.5' && key == 'It2m15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 1.5' && key == 'It2b15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Under 2.0' && key == 'It2m2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Over 2.0' && key == 'It2b2') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                            });
                        }
                        if (odd.name === 'Asian Handicap') {
                            odd.values.forEach((item) => {
                                if (item.value === 'Home +0' && key == 'f10') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Away +0' && key == 'f20') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Home -1' && key == 'f1_1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Away +1' && key == 'f2_1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Home -1.5' && key == 'f1_15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Away +1.5' && key == 'f2_15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Home +1' && key == 'f1Plus1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Away -1' && key == 'f2Plus1') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Home +1.5' && key == 'f1Plus15') {
                                    matchOutcomes[key].odd = item.odd;
                                }
                                if (item.value === 'Away -1.5' && key == 'f2Plus15') {
                                    matchOutcomes[key].odd = item.odd;
                                }

                            });
                        }
                    });
                }
            });
        }
    }
    addOddInObj();

    function getPlayers() {

        // получаем 5 последних матчей домашней команды
        function getLast5MatchesHome() {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
                params: { last: '5', team: `${homeId}` },
                headers: {
                    'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                response.data.response.forEach((el) => {
                    getPlayersTeamHome(el.fixture.id);
                    getStatisticsFixturesHome(el.fixture.id);
                });
            }).catch(function (error) {
                console.error(error);
            });
        }
        getLast5MatchesHome();

        // получаем 5 последних матчей гостевой команды
        function getLast5MatchesAway() {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
                params: { last: '5', team: `${awayId}` },
                headers: {
                    'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };
            axios.request(options).then(function (response) {
                console.log(response.data);
                response.data.response.forEach((el) => {
                    getPlayersTeamAway(el.fixture.id);
                    getStatisticsFixturesAway(el.fixture.id);
                });
            }).catch(function (error) {
                console.error(error);
            });
        }
        getLast5MatchesAway();

        // получаем статистику игроков за последние 5 матчей домашней команды
        function getPlayersTeamHome(id) {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/players',
                params: { fixture: `${id}` },
                headers: {
                    'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };
            axios.request(options).then(function (response) {
                console.log(response.data);
                response.data.response.forEach((el) => {
                    if (homeId == el.team.id) {
                        el.players.forEach(item => {
                            if (item.statistics[0].games.position == "G") {
                                teamInfo.home.goalkeeper.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "D") {
                                teamInfo.home.deffender.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "M") {
                                teamInfo.home.mildFielder.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "F") {
                                teamInfo.home.forvard.rating.push(item.statistics[0].games.rating);
                            }
                        });
                    }
                    if (homeId != el.team.id) {
                        el.players.forEach(item => {
                            if (item.statistics[0].games.position == "G") {
                                teamInfo.vsHome.goalkeeper.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "D") {
                                teamInfo.vsHome.deffender.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "M") {
                                teamInfo.vsHome.mildFielder.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "F") {
                                teamInfo.vsHome.forvard.rating.push(item.statistics[0].games.rating);
                            }
                        });
                    }
                });
            }).catch(function (error) {
                console.error(error);
            });
        }

        // получаем статистку игроков за последние 5 матчей гостевой команды
        function getPlayersTeamAway(id) {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/players',
                params: { fixture: `${id}` },
                headers: {
                    'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };
            axios.request(options).then(function (response) {
                console.log(response.data);
                response.data.response.forEach((el) => {
                    if (homeId == el.team.id) {
                        el.players.forEach(item => {
                            if (item.statistics[0].games.position == "G") {
                                teamInfo.away.goalkeeper.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "D") {
                                teamInfo.away.deffender.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "M") {
                                teamInfo.away.mildFielder.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "F") {
                                teamInfo.away.forvard.rating.push(item.statistics[0].games.rating);
                            }
                        });
                    }
                    if (homeId != el.team.id) {
                        el.players.forEach(item => {
                            if (item.statistics[0].games.position == "G") {
                                teamInfo.vsAway.goalkeeper.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "D") {
                                teamInfo.vsAway.deffender.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "M") {
                                teamInfo.vsAway.mildFielder.rating.push(item.statistics[0].games.rating);
                            }
                            if (item.statistics[0].games.position == "F") {
                                teamInfo.vsAway.forvard.rating.push(item.statistics[0].games.rating);
                            }
                        });
                    }
                });
            }).catch(function (error) {
                console.error(error);
            });
        }
// получаем статистику домашней команды
        function getStatisticsFixturesHome(id) {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics',
                params: {fixture: `${id}`},
                headers: {
                  'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
              };
              
              axios.request(options).then(function (response) {
                  console.log(response.data);
// перебераем ститстику и добавляем в обьект
                  response.data.response.forEach(el => {
                    if(el.team.id == homeId) {
                        el.statistics.forEach(item => {
                            if(item.type == "Shots on Goal") {
                                teamInfo.home.statistics.shotsOnGoal.push(item.value);
                            }
                            if(item.type == "Shots off Goal") {
                                teamInfo.home.statistics.shotsOffGoal.push(item.value);
                            }
                            if(item.type == "Total Shots") {
                                teamInfo.home.statistics.totalShots.push(item.value);
                            }
                            if(item.type == "Blocked Shots") {
                                teamInfo.home.statistics.blockedShots.push(item.value);
                            }
                            if(item.type == "Shots insidebox") {
                                teamInfo.home.statistics.shotsInsidebox.push(item.value);
                            }
                            if(item.type == "Shots outsidebox") {
                                teamInfo.home.statistics.shotsOutsidebox.push(item.value);
                            }
                            if(item.type == "Fouls") {
                                teamInfo.home.statistics.fouls.push(item.value);
                            }
                            if(item.type == "Corner Kicks") {
                                teamInfo.home.statistics.cornerKicks.push(item.value);
                            }
                            if(item.type == "Offsides") {
                                teamInfo.home.statistics.offsides.push(item.value);
                            }
                            if(item.type == "Ball Possession") {
                                teamInfo.home.statistics.ballPossession.push(item.value);
                            }
                            if(item.type == "Yellow Cards") {
                                teamInfo.home.statistics.yellowCards.push(item.value);
                            }
                            if(item.type == "Red Cards") {
                                teamInfo.home.statistics.redCards.push(item.value);
                            }
                            if(item.type == "Goalkeeper Saves") {
                                teamInfo.home.statistics.goalkeeperSaves.push(item.value);
                            }
                            if(item.type == "Total passes") {
                                teamInfo.home.statistics.totalPasses.push(item.value);
                            }
                            if(item.type == "Passes accurate") {
                                teamInfo.home.statistics.passesAccurate.push(item.value);
                            }
                            if(item.type == "Passes %") {
                                teamInfo.home.statistics.passesPercent.push(item.value);
                            }
                        });
                    }
                  });

                  // перебераем ститстику и добавляем в обьект против команды
                  response.data.response.forEach(el => {
                    if(el.team.id != homeId) {
                        el.statistics.forEach(item => {
                            if(item.type == "Shots on Goal") {
                                teamInfo.vsHome.statistics.shotsOnGoal.push(item.value);
                            }
                            if(item.type == "Shots off Goal") {
                                teamInfo.vsHome.statistics.shotsOffGoal.push(item.value);
                            }
                            if(item.type == "Total Shots") {
                                teamInfo.vsHome.statistics.totalShots.push(item.value);
                            }
                            if(item.type == "Blocked Shots") {
                                teamInfo.vsHome.statistics.blockedShots.push(item.value);
                            }
                            if(item.type == "Shots insidebox") {
                                teamInfo.vsHome.statistics.shotsInsidebox.push(item.value);
                            }
                            if(item.type == "Shots outsidebox") {
                                teamInfo.vsHome.statistics.shotsOutsidebox.push(item.value);
                            }
                            if(item.type == "Fouls") {
                                teamInfo.vsHome.statistics.fouls.push(item.value);
                            }
                            if(item.type == "Corner Kicks") {
                                teamInfo.vsHome.statistics.cornerKicks.push(item.value);
                            }
                            if(item.type == "Offsides") {
                                teamInfo.vsHome.statistics.offsides.push(item.value);
                            }
                            if(item.type == "Ball Possession") {
                                teamInfo.vsHome.statistics.ballPossession.push(item.value);
                            }
                            if(item.type == "Yellow Cards") {
                                teamInfo.vsHome.statistics.yellowCards.push(item.value);
                            }
                            if(item.type == "Red Cards") {
                                teamInfo.vsHome.statistics.redCards.push(item.value);
                            }
                            if(item.type == "Goalkeeper Saves") {
                                teamInfo.vsHome.statistics.goalkeeperSaves.push(item.value);
                            }
                            if(item.type == "Total passes") {
                                teamInfo.vsHome.statistics.totalPasses.push(item.value);
                            }
                            if(item.type == "Passes accurate") {
                                teamInfo.vsHome.statistics.passesAccurate.push(item.value);
                            }
                            if(item.type == "Passes %") {
                                teamInfo.vsHome.statistics.passesPercent.push(item.value);
                            }
                        });
                    }
                  });

              }).catch(function (error) {
                  console.error(error);
              });
        }
// получаем статистику гостевой команды
        function getStatisticsFixturesAway(id) {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics',
                params: {fixture: `${id}`},
                headers: {
                  'x-rapidapi-key': 'f570367049msh92d23c8fda1a817p1b03cfjsne8957d93c6e0',
                  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
              };
              
              axios.request(options).then(function (response) {
                  console.log(response.data);

                // перебераем ститстику и добавляем в обьект
                response.data.response.forEach(el => {
                    if(el.team.id == awayId) {
                        el.statistics.forEach(item => {
                            if(item.type == "Shots on Goal") {
                                teamInfo.away.statistics.shotsOnGoal.push(item.value);
                            }
                            if(item.type == "Shots off Goal") {
                                teamInfo.away.statistics.shotsOffGoal.push(item.value);
                            }
                            if(item.type == "Total Shots") {
                                teamInfo.away.statistics.totalShots.push(item.value);
                            }
                            if(item.type == "Blocked Shots") {
                                teamInfo.away.statistics.blockedShots.push(item.value);
                            }
                            if(item.type == "Shots insidebox") {
                                teamInfo.away.statistics.shotsInsidebox.push(item.value);
                            }
                            if(item.type == "Shots outsidebox") {
                                teamInfo.away.statistics.shotsOutsidebox.push(item.value);
                            }
                            if(item.type == "Fouls") {
                                teamInfo.away.statistics.fouls.push(item.value);
                            }
                            if(item.type == "Corner Kicks") {
                                teamInfo.away.statistics.cornerKicks.push(item.value);
                            }
                            if(item.type == "Offsides") {
                                teamInfo.away.statistics.offsides.push(item.value);
                            }
                            if(item.type == "Ball Possession") {
                                teamInfo.away.statistics.ballPossession.push(item.value);
                            }
                            if(item.type == "Yellow Cards") {
                                teamInfo.away.statistics.yellowCards.push(item.value);
                            }
                            if(item.type == "Red Cards") {
                                teamInfo.away.statistics.redCards.push(item.value);
                            }
                            if(item.type == "Goalkeeper Saves") {
                                teamInfo.away.statistics.goalkeeperSaves.push(item.value);
                            }
                            if(item.type == "Total passes") {
                                teamInfo.away.statistics.totalPasses.push(item.value);
                            }
                            if(item.type == "Passes accurate") {
                                teamInfo.away.statistics.passesAccurate.push(item.value);
                            }
                            if(item.type == "Passes %") {
                                teamInfo.away.statistics.passesPercent.push(item.value);
                            }
                        });
                    }
                  });

                  // перебераем ститстику и добавляем в обьект против команды
                  response.data.response.forEach(el => {
                    if(el.team.id != awayId) {
                        el.statistics.forEach(item => {
                            if(item.type == "Shots on Goal") {
                                teamInfo.vsAway.statistics.shotsOnGoal.push(item.value);
                            }
                            if(item.type == "Shots off Goal") {
                                teamInfo.vsAway.statistics.shotsOffGoal.push(item.value);
                            }
                            if(item.type == "Total Shots") {
                                teamInfo.vsAway.statistics.totalShots.push(item.value);
                            }
                            if(item.type == "Blocked Shots") {
                                teamInfo.vsAway.statistics.blockedShots.push(item.value);
                            }
                            if(item.type == "Shots insidebox") {
                                teamInfo.vsAway.statistics.shotsInsidebox.push(item.value);
                            }
                            if(item.type == "Shots outsidebox") {
                                teamInfo.vsAway.statistics.shotsOutsidebox.push(item.value);
                            }
                            if(item.type == "Fouls") {
                                teamInfo.vsAway.statistics.fouls.push(item.value);
                            }
                            if(item.type == "Corner Kicks") {
                                teamInfo.vsAway.statistics.cornerKicks.push(item.value);
                            }
                            if(item.type == "Offsides") {
                                teamInfo.vsAway.statistics.offsides.push(item.value);
                            }
                            if(item.type == "Ball Possession") {
                                teamInfo.vsAway.statistics.ballPossession.push(item.value);
                            }
                            if(item.type == "Yellow Cards") {
                                teamInfo.vsAway.statistics.yellowCards.push(item.value);
                            }
                            if(item.type == "Red Cards") {
                                teamInfo.vsAway.statistics.redCards.push(item.value);
                            }
                            if(item.type == "Goalkeeper Saves") {
                                teamInfo.vsAway.statistics.goalkeeperSaves.push(item.value);
                            }
                            if(item.type == "Total passes") {
                                teamInfo.vsAway.statistics.totalPasses.push(item.value);
                            }
                            if(item.type == "Passes accurate") {
                                teamInfo.vsAway.statistics.passesAccurate.push(item.value);
                            }
                            if(item.type == "Passes %") {
                                teamInfo.vsAway.statistics.passesPercent.push(item.value);
                            }
                        });
                    }
                  });

              }).catch(function (error) {
                  console.error(error);
              });
        }

    }
    getPlayers();

    //  Перебираем турнирную таблицу
    // function iterateStandigs() {
    //     let nameHome = predictionObjApi.teams.home.name,
    //         nameAway = predictionObjApi.teams.away.name;

    //     standigsObj.league.standings[0].forEach((el) => {
    //         if (el.team.name == nameHome) {
    //             teamInfo.home.standigsRating = el.all.win + (el.all.draw / 2) - el.all.lose + el.all.goals.for -
    //                 el.all.goals.against + el.goalsDiff + el.points - el.rank;
    //         }
    //         if (el.team.name == nameAway) {
    //             teamInfo.away.standigsRating = el.all.win + (el.all.draw / 2) - el.all.lose + el.all.goals.for -
    //                 el.all.goals.against + el.goalsDiff + el.points - el.rank;
    //         }
    //     });

    // }
    // iterateStandigs();
    console.log(teamInfo);
}
