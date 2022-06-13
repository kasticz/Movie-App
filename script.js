const APIURL = "https://api.themoviedb.org/3/"
const APIKEY = "04c35731a5ee918f014970082a0088b1"
const contentWrapper = document.querySelector(`.contentWrapper`)
const searchInput = document.querySelector(`.search`)
const searchText = document.querySelector(`.searchText`)
const searchActor = document.querySelector(`.Actor`)
const radios = document.querySelector(`.radios`)
const loadingSpinner = document.querySelector(`.ispinner`)
const searchButton = document.querySelector(`.submit`)

const form = document.querySelector(`form`)

let type;
let toSearch;

async function postData(e){
    e.preventDefault()    
    startLoad()

    let searchValue = searchInput.value

    getSearchType()
    if(toSearch === `Actor`){
        await getActors(searchValue)
        return;
    }

    let moviesDetailedData = []
    let moviesCastData = []
    let recommendations = []
    await getFetches()

    endLoad() 

    for(let i = 0; i < moviesDetailedData.length;i++){
        postMovie(moviesDetailedData[i],moviesCastData[i],recommendations[i])
    }

    

  



    async function getFetches(){

        let moviesData = await (await fetch(`${APIURL}search/${toSearch}?api_key=${APIKEY}&query=${searchValue}&language=en-US&include_adult=false`)).json()
        let moviesList = moviesData.results

        for(movie of moviesList){
            let movieData =  await (await fetch(`${APIURL}${toSearch}/${movie.id}?api_key=${APIKEY}&language=en-US&include_adult=false`)).json()
            moviesDetailedData.push(movieData)       
        }
        for(movie of moviesDetailedData){
            let castData = await  (await fetch(`${APIURL}${toSearch}/${movie.id}/credits?api_key=${APIKEY}&language=en-US`)).json()
            moviesCastData.push(castData.cast)
            let currRecommendations = await (await fetch(`${APIURL}${toSearch}/${movie.id}/recommendations?api_key=${APIKEY}&language=en-US&page=1&include_adult=false`)).json()
            recommendations.push(currRecommendations.results) 
        }
    }
}
function postMovie(movieDetails,movieCast,movieRecommendations,fromRecommendations,fromRecommendationsAppend){      
    let movieCard
    let movieBrief
    let movieImg
    let movieTitle
    let movieRating
    let movieDescr
    let movieGenres
    let movieLength
    let movieCompanyDescr
    let movieCompanyName
    let movieCompanyLogo

    createBriefMovieElements()

    makeRating()

    makeGenres()

    makeMovieLength()

    makePoster()

    makeTitle()

    makeMovieProduction()

    appendBrief()

       


    let movieClose
    let movieDetailed          
    let movieDetailedText
    let movieDetailedTitle
    let movieDetailedActorsWrapper
    let movieRecommendationsWrapper
    let movieRecommendationsText

    createDetailedMovieElements()

    let mainActors = [];
    getMainActors()


    let mainRecommendations = []
    getRecommendations()
    

    movieClose.textContent = `Х`    

    if(movieDetails.overview){
        movieDetailedText.textContent = movieDetails.overview
    }    

    if(mainActors.length){
    movieDetailedTitle.textContent = `В ролях`  
    }

       
    



    appendDetailed()

    createFromRecommendation()

   
        
     
         

    function postActors(actor){                 
        let movieDetailedActors = document.createElement(`div`)      
        let movieDetailedActorsName = document.createElement(`div`)
        let movieDetailedActorsAvatar = document.createElement(`img`)
        let movieDetailedActorsCharacter = document.createElement(`div`)

        movieDetailedActorsName.classList.add(`movieDetailedActorsName`)
        movieDetailedActorsAvatar.classList.add(`movieDetailedActorsAvatar`)
        movieDetailedActorsCharacter.classList.add(`movieDetailedActorsCharacter`)
        movieDetailedActors.classList.add(`movieDetailedActors`)

        movieDetailedActorsName.textContent = actor.name

        if(actor.profile_path){
            movieDetailedActorsAvatar.src = `https://image.tmdb.org/t/p/original${actor.profile_path}`
        }else{
            movieDetailedActorsAvatar.src = `./placeholderAvatar.png`
        }
        
        movieDetailedActorsCharacter.textContent = `as ${actor.character}`

        movieDetailedActors.append(movieDetailedActorsName)
        movieDetailedActors.append(movieDetailedActorsAvatar)
        movieDetailedActors.append(movieDetailedActorsCharacter) 
        
        movieDetailedActors.addEventListener(`click`,async function(e){
            let actorData = await (await fetch(`${APIURL}person/${actor.id}?api_key=${APIKEY}&language=en-US`)).json()
            let creditsData = await(await fetch(`https://api.themoviedb.org/3/person/${actorData.id}/combined_credits?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`)).json()
            let detailedCreditsData = creditsData.cast
            detailedCreditsData.sort((a,b)=>{
                return b.popularity - a.popularity;
            })
            console.log([[actorData,detailedCreditsData.slice(0,3)]])
            postActor([actorData,detailedCreditsData.slice(0,3)],true,movieCard)
        })
        
        movieDetailedActorsWrapper.append(movieDetailedActors)            
    }

    function postRecommendations(recommendation){
        let movieRecommendationsItem = document.createElement(`div`)
        let movieRecommendationsTitle = document.createElement(`div`)
        let movieRecommendationsImg = document.createElement(`img`)

        movieRecommendationsTitle.classList.add(`movieRecommendationsTitle`)
        movieRecommendationsImg.classList.add(`movieRecommendationsImg`)
        movieRecommendationsItem.classList.add(`movieRecommendationsItem`)

        let recomTitle;
        if(recommendation.title){
            recomTitle = recommendation.title
        }else{
            recomTitle = recommendation.name
        }
        movieRecommendationsTitle.textContent = recomTitle
        if(recommendation.backdrop_path){
            movieRecommendationsImg.src = `https://image.tmdb.org/t/p/original${recommendation.backdrop_path}`
        }else{
            movieRecommendationsImg.src = `./placeholderMovie.png`
        }
        movieRecommendationsItem.addEventListener(`click`,async function(e){
            let movieRecommendationsDetails = await (await fetch(`${APIURL}${recommendation.media_type}/${recommendation.id}?api_key=${APIKEY}&language=en-US&include_adult=false`)).json()
            let movieRecommendationsCast = await  (await fetch(`${APIURL}${recommendation.media_type}/${recommendation.id}/credits?api_key=${APIKEY}&language=en-US`)).json()
            let movieRecommendationsRecommendations = await (await fetch(`${APIURL}${recommendation.media_type}/${recommendation.id}/recommendations?api_key=${APIKEY}&language=en-US&page=1&include_adult=false`)).json()

            postMovie(movieRecommendationsDetails,movieRecommendationsCast.cast,movieRecommendationsRecommendations.results,true,movieCard)
        });


        movieRecommendationsItem.append(movieRecommendationsTitle)
        movieRecommendationsItem.append(movieRecommendationsImg)
        movieRecommendationsWrapper.append(movieRecommendationsItem)
    }

    function onMovieClick(e){  
        let movie;
        if(e){
            movie = e.target.closest(`.movieCard`) 
        }else{
            movie = movieCard;
        }            
                
        
        let movieBrief = movie.querySelector(`.movieBrief`)
        let movieDetailed = movie.querySelector(`.movieDetailed`)
        let movieClose = movie.querySelector(`.movieClose`)



        setTimeout(() => {
            document.addEventListener(`click`,onBigMovieClick)            
        }, 50);
        
        movie.removeEventListener(`click`,onMovieClick)

        if(movieDetailed){
            movieDetailed.classList.toggle(`movieDetailedActive`)
        }
        movieClose.classList.toggle(`movieCloseAlt`)
        
        
        movie.classList.toggle(`movieCardAlt`)
        movieBrief.classList.toggle(`movieBriefAlt`)
        movie.dataset.big = `1` 

        setTimeout(() => {
            window.scrollBy(0,movie.getBoundingClientRect().top - 100)
        }, 50);             

        function onBigMovieClick(e){
            if(e.target === movie.querySelector(`.movieClose`) || !movie.contains(e.target)){
                document.removeEventListener(`click`,onBigMovieClick)
                movie.addEventListener(`click`,onMovieClick)
                if(e.target.closest(`.fromRecommendations`)){
                    e.target.closest(`.fromRecommendations`).remove()
                    return;
                }
                movie.classList.toggle(`movieCardAlt`)
                if(e.target === movie.querySelector(`movieClose`)){
                    e.target.classList.toggle(`movieCloseAlt`)
                }
                movieClose.classList.toggle(`movieCloseAlt`)
                
                if(movieDetailed){
                    movieDetailed.classList.toggle(`movieDetailedActive`)
                }
                
                movieBrief.classList.toggle(`movieBriefAlt`)
                movie.dataset.big = `0` 

                if(!(e.target.closest(`.movieCard`) && e.target.closest(`.movieCard`) != movie)){
                    window.scrollTo(0,movie.getBoundingClientRect().top + window.pageYOffset - 100)
                }                
                let addedFromRecommendationsMovies = contentWrapper.querySelectorAll(`.fromRecommendations`)
                if(e.target != movieClose){
                    for(let movie of addedFromRecommendationsMovies){
                        movie.remove()
                    }                        
                }
            }
        }
    }   
    function createBriefMovieElements(){
        movieCard = document.createElement(`div`)
        movieBrief = document.createElement(`div`)
        movieImg = document.createElement('img')
        movieTitle = document.createElement(`div`)
        movieRating = document.createElement(`div`)
        movieDescr = document.createElement(`div`)
        movieGenres = document.createElement(`div`)
        movieLength = document.createElement(`div`)
        movieCompanyDescr = document.createElement(`div`)
        movieCompanyName = document.createElement(`div`)
        movieCompanyLogo = document.createElement(`img`)

        movieBrief.classList.add(`movieBrief`)
        movieCard.classList.add(`movieCard`)

        if(fromRecommendations){
            movieCard.classList.add(`fromRecommendations`)
        }

        movieDescr.classList.add(`movieDescr`)       
        movieRating.classList.add(`movieRating`) 
        movieGenres.classList.add(`movieGenres`)
        movieLength.classList.add(`movieLength`)
        movieImg.classList.add(`movieImg`)
        movieTitle.classList.add(`movieTitle`)
    }   
        
    function makeRating(){
        movieRating.textContent = movieDetails.vote_average * 10
        let rating = movieRating.textContent;
        let movieRatingColor = `#f1070c`
        if(rating > 20) movieRatingColor = `#f04d45`  
        if(rating > 40) movieRatingColor = `#f07a56`
        if(rating > 60) movieRatingColor = `#ebba32`
        if(rating > 70) movieRatingColor = `#cfeb32`
        if(rating > 80) movieRatingColor = `#a8e843`
        if(rating > 90) movieRatingColor = `#43e80f`
        movieRating.style.color = movieRatingColor
    }  
    
    function makeGenres(){
        for(let i = 0; i < movieDetails.genres.length;i++){
            if(i == 2) break;
            movieGenres.textContent += movieDetails.genres[i].name.slice(0,1).toUpperCase() +  movieDetails.genres[i].name.slice(1) + `, `
        }
        movieGenres.textContent = movieGenres.textContent.slice(0,movieGenres.textContent.length - 2)
    }

    function makeMovieLength(){
        let movieLengthText;
        if(movieDetails.hasOwnProperty(`runtime`)){
            if(movieDetails.runtime == 0){
                movieLengthText = `? ч ? мин.`
            }else{
                movieLengthText = `${Math.floor(+movieDetails.runtime / 60)} ч ${movieDetails.runtime % 60} мин.`
            }

        }else{
            movieLengthText = `${movieDetails.number_of_episodes} episodes`
        }
            
        movieLength.textContent = movieLengthText
    }

    function makePoster(){
        if(movieDetails.poster_path){
            movieImg.src = `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`
        }else{
            movieImg.src = `./placeholderMovie.png`
        }
    }

    function makeTitle(){
        let title;
        if(movieDetails.hasOwnProperty(`release_date`)){
            title = `${movieDetails.title}(${movieDetails.release_date.slice(0,4)})`
        }
        if(movieDetails.hasOwnProperty(`first_air_date`)){
            title = `${movieDetails.name}(${movieDetails.first_air_date.slice(0,4)})`
        }
        movieTitle.textContent = title;
        }

        function makeMovieProduction(){
        const movieMainProd = movieDetails.production_companies[0]
        if(movieMainProd){
            movieCompanyName.textContent = movieMainProd.name
            movieCompanyDescr.append(movieCompanyName)
            if(movieMainProd.logo_path){
                movieCompanyLogo.src = `https://image.tmdb.org/t/p/original/${movieMainProd.logo_path}` 
                movieCompanyDescr.append(movieCompanyLogo)            
            }                 
        } 
    }

    function appendBrief(){
        movieBrief.append(movieTitle)
        movieBrief.append(movieImg) 
        movieDescr.append(movieRating)
        movieDescr.append(movieGenres)
        movieDescr.append(movieLength)                   
        movieBrief.append(movieDescr)
        movieBrief.append(movieCompanyDescr)
        movieCard.append(movieBrief)
    }

    function createDetailedMovieElements(){
        movieClose = document.createElement(`div`)
        movieDetailed = document.createElement(`div`)            
        movieDetailedText = document.createElement(`p`)
        movieDetailedTitle = document.createElement(`div`)  
        movieDetailedActorsWrapper = document.createElement(`div`) 
        movieRecommendationsWrapper = document.createElement(`div`)
        movieRecommendationsText = document.createElement(`div`)

        movieClose.classList.add(`movieClose`)
        movieDetailedText.classList.add(`movieDetailedText`)
        movieDetailedTitle.classList.add(`movieDetailedTitle`)
        movieDetailed.classList.add(`movieDetailed`)
        movieCompanyDescr.classList.add(`movieCompanyDescr`)
        movieCompanyName.classList.add(`movieCompanyName`)
        movieCompanyLogo.classList.add(`movieCompanyLogo`)
        movieDetailedActorsWrapper.classList.add(`movieDetailedActorsWrapper`)  
        movieRecommendationsWrapper.classList.add(`movieRecommendationsWrapper`)
    }
    function getMainActors(){            
        if(movieCast.length){
            for(let i = 0; i < movieCast.length; i++){
                if(i === 5) break;
                mainActors.push(movieCast[`${i}`])
            }   
        }
    }

    function getRecommendations(){
        if(movieRecommendations.length){
            for(let i = 0; i < movieRecommendations.length;i++){
                if(i === 5) break;
                mainRecommendations.push(movieRecommendations[`${i}`])
            }
        }
    } 
    
    function appendDetailed(){
        movieCard.append(movieClose)
        if(movieDetailedText.textContent){
            movieDetailed.append(movieDetailedText)
        }
        if(movieDetailedTitle.textContent){
            movieDetailed.append(movieDetailedTitle)
            }

        mainActors.forEach(item => postActors(item))

        if(mainActors.length){
            movieDetailed.append(movieDetailedActorsWrapper)
            }
        if(mainRecommendations.length){                
            movieRecommendationsText.classList.add(`movieRecommendationsText`)
            movieRecommendationsText.textContent = `Если вам понравился этот ${type}, рекомендуем к просмотру`        
            mainRecommendations.forEach(item => postRecommendations(item))
            movieDetailed.append(movieRecommendationsText)        
            movieDetailed.append(movieRecommendationsWrapper)
        } 
        if(movieDetailed.textContent){
            movieCard.append(movieDetailed)
        }
    }

    function createFromRecommendation(){
        if(fromRecommendations){
            fromRecommendationsAppend.append(movieCard)
            onMovieClick()       
            } else {
            contentWrapper.append(movieCard)
            movieCard.addEventListener(`click`,onMovieClick) 
            }  
    }
}
form.addEventListener(`submit`,postData)








getActors(`Hugh Calum Laurie`)
async function  getActors(Actor){
    let actorsPreData = await (await fetch(`${APIURL}search/person?api_key=${APIKEY}&language=en-US&query=${Actor}&page=1&include_adult=false`)).json()
    let allActors = actorsPreData.results
    let actors = []
    for(let actor of allActors){
        let actorData = await (await fetch(`${APIURL}person/${actor.id}?api_key=${APIKEY}&language=en-US`)).json()
        actors.push([actorData,actor.known_for])
    }
    endLoad()
    console.log(actors)

    actors.sort((a,b)=>{
       return b[0].popularity - a[0].popularity
    })

    for(let i = 0; i < actors.length; i++){
        await postActor(actors[i])
    }



    

    
}
async function postActor(actor,fromRecommendations,fromRecommendationsAppend){
    console.log(actor)
        let actorCard;
        let actorBrief;
        let actorName;
        let actorImg;
        let actorAge;

    
    
        createBriefElements() 
        if(fromRecommendations){
            actorCard.classList.add(`fromRecommendations`)
        }   
    
        fillBrief()
    
        appendBrief()

        let actorDetailed;
        let actorClose;
        let actorDetailedText;  
        let actorMainFilmsWrapperTitle;    
        let actorDetailedMainFilmsWrapper;


        createDetailedElements()
        actorClose.textContent = `Х`  

       await fillDetailed()

        appendDetailed()

    
        createFromRecommendation()

        
    
        function createBriefElements(){
            actorCard = document.createElement(`div`)
            actorBrief = document.createElement(`div`)
            actorName = document.createElement(`div`)
            actorImg = document.createElement(`img`)
            actorDescr = document.createElement(`div`)
            actorAge = document.createElement(`div`)
            actorPopularity = document.createElement(`div`)
    
            actorCard.classList.add(`actorCard`)
            actorBrief.classList.add(`actorBrief`)
            actorName.classList.add(`actorName`)
            actorImg.classList.add(`actorImg`)
            actorDescr.classList.add(`actorDescr`)
            actorAge.classList.add(`actorAge`)  
            actorPopularity.classList.add(`actorPopularity`)                      
        }
        function appendBrief(){
            actorDescr.append(actorPopularity)
            actorDescr.append(actorAge)
            actorBrief.append(actorName)
            actorBrief.append(actorImg)
            actorBrief.append(actorDescr)
            actorCard.append(actorBrief)
            contentWrapper.append(actorCard)
        }
        function fillBrief(){
            actorName.textContent = actor[0].name
            if(actor[0].profile_path){
                actorImg.src = `https://image.tmdb.org/t/p/original${actor[0].profile_path}`
            }else{
                actorImg.src = `./placeholderAvatar.png`
            }
            

            function getAge(){
                let now = new Date(Date.now())
                let birthday = new Date(actor[0].birthday)
                let birthdayThisYear = 1
                if(now.getMonth() - birthday.getMonth() > 0){
                    birthdayThisYear = 0
                }
                return now.getFullYear() - birthday.getFullYear() - birthdayThisYear + ` лет`
            }          

           actorAge.textContent =  getAge()
           actorPopularity.textContent = actor[0].popularity + ` поисков`
        }
        function createDetailedElements(){
            actorDetailed = document.createElement(`div`)
            actorClose = document.createElement(`div`)
            actorDetailedText = document.createElement(`div`);      
            actorMainFilmsWrapperTitle = document.createElement(`div`)
            actorDetailedMainFilmsWrapper = document.createElement(`div`)




            actorDetailed.classList.add(`actorDetailed`)
            actorClose.classList.add(`actorClose`)
            actorDetailedText.classList.add(`actorDetailedText`)  
            actorMainFilmsWrapperTitle.classList.add(`actorMainFilmsWrapperTitle`)    
            actorDetailedMainFilmsWrapper.classList.add(`actorDetailedMainFilmsWrapper`)

             
        }
       

        function appendDetailed(){
            actorDetailed.append(actorDetailedText)
            actorDetailed.append(actorMainFilmsWrapperTitle)
            actorDetailed.append(actorDetailedMainFilmsWrapper)
            actorCard.append(actorClose)
            if(actorDetailed.textContent){
                actorCard.append(actorDetailed)
            }
            
        }

       async function fillDetailed(){
            if(actor[0].hasOwnProperty(`biography`)){
                actorDetailedText.textContent = actor[0].biography 
            }
            if(actor[1]){
                actorMainFilmsWrapperTitle.textContent = `Наиболее популярные произведения`
               await fillMainFilms()
               
            }

           async function fillMainFilms(){
                if(actor[1].length){
                    for(let movie of actor[1]){
                       await postMainMovie(movie)
                    }
                }

                 async function postMainMovie(movie){

                    actorMainFilmsItem = document.createElement(`div`)
                    actorMainFilmsTitle = document.createElement(`div`)
                    actorMainFilmsImg = document.createElement(`img`)
                    actorMainFilmsCharacter = document.createElement(`div`)

                    actorMainFilmsItem.classList.add(`actorMainFilmsItem`)
                    actorMainFilmsTitle.classList.add(`actorMainFilmsTitle`)
                    actorMainFilmsImg.classList.add(`actorMainFilmsImg`)
                    actorMainFilmsCharacter.classList.add(`actorMainFilmsCharacter`) 
   

                    actorMainFilmsTitle.textContent = movie.title || movie.name
                    actorMainFilmsImg.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    actorMainFilmsCharacter.textContent = `as ` + await getCharacter()

                    actorMainFilmsItem.append(actorMainFilmsTitle)
                    actorMainFilmsItem.append(actorMainFilmsImg)
                    actorMainFilmsItem.append(actorMainFilmsCharacter)
                    actorDetailedMainFilmsWrapper.append(actorMainFilmsItem)

                    actorMainFilmsItem.addEventListener(`click`,async function(e){
                        let movieRecommendationsDetails = await (await fetch(`${APIURL}${movie.media_type}/${movie.id}?api_key=${APIKEY}&language=en-US&include_adult=false`)).json()
                        let movieRecommendationsCast = await  (await fetch(`${APIURL}${movie.media_type}/${movie.id}/credits?api_key=${APIKEY}&language=en-US`)).json()
                        let movieRecommendationsRecommendations = await (await fetch(`${APIURL}${movie.media_type}/${movie.id}/recommendations?api_key=${APIKEY}&language=en-US&page=1&include_adult=false`)).json()
            
                        postMovie(movieRecommendationsDetails,movieRecommendationsCast.cast,movieRecommendationsRecommendations.results,true,actorCard)

                    })

                    async function getCharacter(){
                        let allCredits = await (await fetch(`${APIURL}/person/${actor[0].id}/combined_credits?api_key=${APIKEY}&language=en-US`)).json()
                        let x = allCredits.cast          
                        for(let searchMovie of x ){                            
                            if(searchMovie.title === movie.title){                               
                                return searchMovie.character
                            }
                        }
                    }
                }
            }   
        }
        function onActorClick(e){    
            let actor;
            if(e){
                actor = e.target.closest(`.actorCard`) 
            }else{
                actor = actorCard;
            }            
                    
            
            let actorBrief = actor.querySelector(`.actorBrief`)
            let actorDetailed = actor.querySelector(`.actorDetailed`)
            let actorClose = actor.querySelector(`.actorClose`)
    
    
    
            setTimeout(() => {
                document.addEventListener(`click`,closeActor)            
            }, 50);
            
            actor.removeEventListener(`click`,onActorClick)
    
            if(actorDetailed){
                actorDetailed.classList.toggle(`actorDetailedActive`)
            }
            actorClose.classList.toggle(`actorCloseAlt`)
            
            
            actor.classList.toggle(`actorCardAlt`)
            actorBrief.classList.toggle(`actorBriefAlt`)
            actor.dataset.big = `1` 
    
            setTimeout(() => {
                window.scrollBy(0,actor.getBoundingClientRect().top - 100)
            }, 50);             
    
            function closeActor(e){
                if(e.target === actor.querySelector(`.actorClose`) || !actor.contains(e.target)){
                    console.log(1)
                    document.removeEventListener(`click`,closeActor)
                    actor.addEventListener(`click`,onActorClick)
                    if(e.target.closest(`.fromRecommendations`)){
                        e.target.closest(`.fromRecommendations`).remove()
                        return;
                    }
                    actor.classList.toggle(`actorCardAlt`)
                    if(e.target === actor.querySelector(`actorClose`)){
                        e.target.classList.toggle(`actorCloseAlt`)
                    }
                    actorClose.classList.toggle(`actorCloseAlt`)
                    
                    if(actorDetailed){
                        actorDetailed.classList.toggle(`actorDetailedActive`)
                    }
                    
                    actorBrief.classList.toggle(`actorBriefAlt`)
                    actor.dataset.big = `0` 
    
                    if(!(e.target.closest(`.actorCard`) && e.target.closest(`.actorCard`) != actor)){
                        window.scrollTo(0,actor.getBoundingClientRect().top + window.pageYOffset - 100)
                    }                
                    let addedFromRecommendationsMovies = contentWrapper.querySelectorAll(`.fromRecommendations`)
                    if(e.target != actorClose){
                        for(let movie of addedFromRecommendationsMovies){
                            movie.remove()
                        }                        
                    }
                }
            }
        }
        function createFromRecommendation(){
            if(fromRecommendations){
                fromRecommendationsAppend.append(actorCard)
                onActorClick()       
                } else {
                contentWrapper.append(actorCard)
                actorCard.addEventListener(`click`,onActorClick) 
            }  
        }
    }



function startLoad(){
    loadingSpinner.style.display = `block`
    searchButton.childNodes[2].data = `Ищем...`
} 
function endLoad(){
    form.classList.add(`formAlt`)
    searchText.style.display = `none`;
    searchActor.textContent = `Актёр`
    radios.classList.add(`radiosAlt`)
    searchInput.classList.add(`searchAlt`)
    loadingSpinner.style.display = `none`
    searchButton.childNodes[2].data = `Найти`
    contentWrapper.innerHTML = ``
}
function getSearchType(){
    let allRadios = form.querySelectorAll(`[type="radio"]`);
    for(let radio of allRadios){
        if (radio.checked){
            type = radio.value.split(`,`)[0]
            toSearch = radio.value.split(`,`)[1].slice(1)
            break;
        }
    }
}   
