const APIURL = "https://api.themoviedb.org/3/"
const APIKEY = "04c35731a5ee918f014970082a0088b1"
const moviesWrapper = document.querySelector(`.moviesWrapper`)

const form = document.querySelector(`form`)



async function getData(e){
    // e.preventDefault()
    let movieName = form.querySelector(`.search`).value
    console.log(movieName)

    let moviesData = await (await fetch(`${APIURL}search/movie?api_key=${APIKEY}&query=Avengers&language=ru-ru`)).json()
    let moviesList = moviesData.results

    let moviesDetailedData = [];
    let moviesCastData = [];
    loop1:
    for(movie of moviesList){
        let movieData =  await (await fetch(`${APIURL}movie/${movie.id}?api_key=${APIKEY}&language=ru-ru`)).json()
        let castData = await  (await fetch(`${APIURL}movie/${movie.id}/credits?api_key=${APIKEY}&language=ru-ru`)).json()
        moviesDetailedData.push(movieData)
        moviesCastData.push(castData.cast)
    }
    moviesDetailedData.sort((a,b)=>{
        return a.popularity - b.popularity
    })

    for(let movie of moviesDetailedData){
        postMovie(movie)
    }

    function postMovie(movieDetails,movieCast){
        let movie = document.createElement(`div`)
        let movieImg = document.createElement('img')
        let movieTitle = document.createElement(`div`)
        let movieRating = document.createElement(`div`)
        let movieDescr = document.createElement(`div`)
        let movieGenres = document.createElement(`div`)
        let movieLength = document.createElement(`div`)
        let movieCompanyDescr = document.createElement(`div`)
        let movieCompanyName = document.createElement(`div`)
        let movieCompanyLogo = document.createElement(`img`)
        movie.classList.add(`movie`)

        movieCompanyDescr.classList.add(`movieCompanyDescr`)
        movieCompanyName.classList.add(`movieCompanyName`)
        movieCompanyLogo.classList.add(`movieCompanyLogo`)

        const movieMainProd = movieDetails.production_companies[0]
        if(movieMainProd){
            movieCompanyName.textContent = movieMainProd.name
            movieCompanyDescr.append(movieCompanyName)
            if(movieMainProd.logo_path){
                movieCompanyLogo.src = `https://image.tmdb.org/t/p/original/${movieMainProd.logo_path}` 
                movieCompanyDescr.append(movieCompanyLogo)
                
            }
                      
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
        console.log(+movieDetails.runtime % 60)
        movieLength.textContent = movieLengthText
        
        
        movieDescr.append(movieRating)
        movieDescr.append(movieGenres)
        movieDescr.append(movieLength)


        

        movieImg.src = `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`
        movieImg.classList.add(`movieImg`)
        movie.prepend(movieImg) 
        
        
        movieTitle.classList.add(`movieTitle`)
        movieTitle.textContent = `${movieDetails.title}(${movieDetails.release_date.slice(0,4)})`
        movie.prepend(movieTitle)       
        movie.append(movieDescr)
        movie.append(movieCompanyDescr)



        moviesWrapper.prepend(movie)   

    }

    console.log(moviesDetailedData)
    console.log(moviesCastData)
    console.log(moviesList)
}
getData()
form.addEventListener(`submit`,getData)