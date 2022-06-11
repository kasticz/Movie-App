const APIURL = "https://api.themoviedb.org/3/"
const APIKEY = "04c35731a5ee918f014970082a0088b1"
const moviesWrapper = document.querySelector(`.moviesWrapper`)
const searchInput = document.querySelector(`.search`)

const form = document.querySelector(`form`)



async function getData(e){
    e.preventDefault()
    moviesWrapper.innerHTML = ``

    let searchValue = searchInput.value
    let type = `фильм`
    let movieName = form.querySelector(`.search`).value

    let moviesData = await (await fetch(`${APIURL}search/movie?api_key=${APIKEY}&query=${searchValue}&language=en-US&include_adult=false`)).json()
    let moviesList = moviesData.results

    let moviesDetailedData = [];
    let moviesCastData = [];
    let recommendations = []
    loop1:
    for(movie of moviesList){
        let movieData =  await (await fetch(`${APIURL}movie/${movie.id}?api_key=${APIKEY}&language=en-US&include_adult=false`)).json()
        moviesDetailedData.push(movieData)        
    }
    for(movie of moviesDetailedData){
        let castData = await  (await fetch(`${APIURL}movie/${movie.id}/credits?api_key=${APIKEY}&language=en-US`)).json()
        moviesCastData.push(castData.cast)
        let currRecommendations = await (await fetch(`${APIURL}movie/${movie.id}/recommendations?api_key=${APIKEY}&language=en-US&page=1&include_adult=false`)).json()
        recommendations.push(currRecommendations.results)
    }

    for(let i = 0; i < moviesDetailedData.length;i++){
        postMovie(moviesDetailedData[i],moviesCastData[i],recommendations[i])
    }

    function postMovie(movieDetails,movieCast,movieRecommendations,fromRecommendations,fromRecommendationsAppend){
        // ---------------------------------movieBrief--------------------------------------------
        let movieCard = document.createElement(`div`)
        let movieBrief = document.createElement(`div`)
        let movieImg = document.createElement('img')
        let movieTitle = document.createElement(`div`)
        let movieRating = document.createElement(`div`)
        let movieDescr = document.createElement(`div`)
        let movieGenres = document.createElement(`div`)
        let movieLength = document.createElement(`div`)
        let movieCompanyDescr = document.createElement(`div`)
        let movieCompanyName = document.createElement(`div`)
        let movieCompanyLogo = document.createElement(`img`)


        movieBrief.classList.add(`movieBrief`)
        movieCard.classList.add(`movieCard`)

        if(fromRecommendations){
            movieCard.classList.add(`fromRecommendations`)
        }

        movieDescr.classList.add(`movieDescr`)       
        movieRating.classList.add(`movieRating`)        
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

        movieGenres.classList.add(`movieGenres`)
        for(let i = 0; i < movieDetails.genres.length;i++){
            if(i == 2) break;
            movieGenres.textContent += movieDetails.genres[i].name.slice(0,1).toUpperCase() +  movieDetails.genres[i].name.slice(1) + `, `
        }
        movieGenres.textContent = movieGenres.textContent.slice(0,movieGenres.textContent.length - 2)

        movieLength.classList.add(`movieLength`)
        let movieLengthText = `${Math.floor(+movieDetails.runtime / 60)} ч ${movieDetails.runtime % 60} мин.`
        movieLength.textContent = movieLengthText
        
        
        movieDescr.append(movieRating)
        movieDescr.append(movieGenres)
        movieDescr.append(movieLength)

        
        if(movieDetails.poster_path){
            movieImg.src = `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`
        }else{
            movieImg.src = `./placeholderMovie.png`
        }
        
        movieImg.classList.add(`movieImg`)
        movieBrief.prepend(movieImg) 
      
        
        movieTitle.classList.add(`movieTitle`)
        movieTitle.textContent = `${movieDetails.title}(${movieDetails.release_date.slice(0,4)})`


        const movieMainProd = movieDetails.production_companies[0]
        if(movieMainProd){
            movieCompanyName.textContent = movieMainProd.name
            movieCompanyDescr.append(movieCompanyName)
            if(movieMainProd.logo_path){
                movieCompanyLogo.src = `https://image.tmdb.org/t/p/original/${movieMainProd.logo_path}` 
                movieCompanyDescr.append(movieCompanyLogo)            
            }                 
        }    


        movieBrief.prepend(movieTitle)       
        movieBrief.append(movieDescr)
        movieBrief.append(movieCompanyDescr)
        movieCard.append(movieBrief)
        // ---------------------------------movieBrief--------------------------------------------

        // ---------------------------------movieDetailed--------------------------------------------
        let movieClose = document.createElement(`div`)
        let movieDetailed = document.createElement(`div`)            
        let movieDetailedText = document.createElement(`p`)
        let movieDetailedTitle = document.createElement(`div`)  
        let movieDetailedActorsWrapper = document.createElement(`div`) 
        let movieRecommendationsWrapper = document.createElement(`div`)
        let movieRecommendationsText = document.createElement(`div`)


        movieClose.classList.add(`movieClose`)
        movieDetailedText.classList.add(`movieDetailedText`)
        movieDetailedTitle.classList.add(`movieDetailedTitle`)
        movieDetailed.classList.add(`movieDetailed`)
        movieCompanyDescr.classList.add(`movieCompanyDescr`)
        movieCompanyName.classList.add(`movieCompanyName`)
        movieCompanyLogo.classList.add(`movieCompanyLogo`)
        movieDetailedActorsWrapper.classList.add(`movieDetailedActorsWrapper`)  
        movieRecommendationsWrapper.classList.add(`movieRecommendationsWrapper`)

        
        let mainActors = [];
        for(let i = 0; i < movieCast.length; i++){
            if(i === 5) break;
            mainActors.push(movieCast[`${i}`])
        }      

        let mainRecommendations = []
        if(movieRecommendations.length){
            for(let i = 0; i < movieRecommendations.length;i++){
                if(i === 5) break;
                mainRecommendations.push(movieRecommendations[`${i}`])
            }
        }


        
        movieClose.textContent = `Х`
        

        if(movieDetails.overview){
            movieDetailedText.textContent = movieDetails.overview
        }
        

       if(mainActors.length){
        movieDetailedTitle.textContent = `В ролях`  
       }
               


        
        
        mainActors.forEach(item => postActors(item)) 

        





        movieCard.append(movieClose)
        if(movieDetailedText.textContent){
            movieDetailed.append(movieDetailedText)
        }
        if(movieDetailedTitle.textContent){
            movieDetailed.append(movieDetailedTitle)
        }
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
          

        // ---------------------------------movieDetailed--------------------------------------------      
         if(fromRecommendations){
            fromRecommendationsAppend.append(movieCard)
            onMovieClick()
            // movieDetailed.classList.toggle(`movieDetailedActive`)  
            // movieClose.classList.toggle(`movieCloseAlt`)             
            // movieCard.classList.toggle(`movieCardAlt`)
            // movieBrief.classList.toggle(`movieBriefAlt`)
            // movieCard.dataset.big = `1`   
            // document.addEventListener(`click`,onBigMovieClick)        
         } else {
            moviesWrapper.append(movieCard)
            movieCard.addEventListener(`click`,onMovieClick) 
         }     
        
        
         

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
            
            movieDetailedActorsWrapper.append(movieDetailedActors)            
        }

        function postRecommendations(recommendation){
            let movieRecommendationsItem = document.createElement(`div`)
            let movieRecommendationsTitle = document.createElement(`div`)
            let movieRecommendationsImg = document.createElement(`img`)

            movieRecommendationsTitle.classList.add(`movieRecommendationsTitle`)
            movieRecommendationsImg.classList.add(`movieRecommendationsImg`)
            movieRecommendationsItem.classList.add(`movieRecommendationsItem`)

            movieRecommendationsTitle.textContent = recommendation.title
            if(recommendation.backdrop_path){
                movieRecommendationsImg.src = `https://image.tmdb.org/t/p/original${recommendation.backdrop_path}`
            }else{
                movieRecommendationsImg.src = `./placeholderMovie.png`
            }
            movieRecommendationsItem.addEventListener(`click`,async function(e){
                let movieRecommendationsDetails = await (await fetch(`${APIURL}movie/${recommendation.id}?api_key=${APIKEY}&language=en-US&include_adult=false`)).json()
                let movieRecommendationsCast = await  (await fetch(`${APIURL}movie/${recommendation.id}/credits?api_key=${APIKEY}&language=en-US`)).json()
                let movieRecommendationsRecommendations = await (await fetch(`${APIURL}movie/${recommendation.id}/recommendations?api_key=${APIKEY}&language=en-US&page=1&include_adult=false`)).json()

                console.log(movieRecommendationsCast.cast)

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
            // if(e.target.closest(`.fromRecommendations`)){
            //     e.stopPropagation()
            // }
                  
            
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
                    let addedFromRecommendationsMovies = moviesWrapper.querySelectorAll(`.fromRecommendations`)
                    if(e.target != movieClose){
                        for(let movie of addedFromRecommendationsMovies){
                            movie.remove()
                        }                        
                    }
                }
            }
        }
    }

   

    console.log(moviesDetailedData)
    console.log(moviesCastData)
    console.log(recommendations)
}
form.addEventListener(`submit`,getData)







