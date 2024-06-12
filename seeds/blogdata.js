const mongoose =require('mongoose')
const blogmodel = require('../model/blog_model');


mongoose.connect("mongodb://localhost:27017/animal").then(()=>{
    console.log("connection establish!!")
}).catch((err)=>{
    console.log(err)
})

let img = {
    1:'https://i.pinimg.com/474x/ca/10/60/ca106004d8dd76bec74e9cbfc99ef0bf.jpg',
    2: 'https://i.pinimg.com/474x/63/e6/5c/63e65c9f222efd5f9a7656c00bd4de1a.jpg',
    3:'https://i.pinimg.com/474x/90/6d/e9/906de98472871f3a9373d7a147fe3885.jpg'
}
const seedDatabase = async()=>{
    await blogmodel.deleteMany({});
    for(let i=0;i<10;i++){
        const detail = new blogmodel({
            img:img[Math.floor(Math.random()*3)+1],
            title:"Sheep: Exploring Their World",
            metaTitle:"Discovering the Woolly World of Sheep: Insights into Behavior, Farming, and Cultural Significance",
            heading:"The Enigmatic World of Sheep: Insights into Behavior, Farming, and Culture",
            topic: "Sheep: Insights into Their Lives and Significance",
            date :Date.now(),
            blog:`Introduction:
            Welcome to the wonderful world of sheep! Often associated with fluffy coats and peaceful grazing, sheep are fascinating creatures with a rich history of coexistence with humans. In this blog post, we'll explore the unique characteristics, behavior, and significance of sheep in agriculture and culture.</br></br>
            The Diversity of Sheep:
            Sheep come in various breeds, each with its own distinct characteristics and traits. From the iconic Merino sheep known for their fine wool to the hardy Icelandic sheep adapted to harsh climates, there's a breed for every environment and purpose. Exploring the diversity of sheep breeds sheds light on the remarkable adaptability and genetic diversity within the species.</br></br>
            Life on the Farm:
            Sheep play a crucial role in agriculture, providing wool, meat, and milk to communities around the world. From traditional pastoral farming to modern intensive production systems, sheep farming practices vary widely depending on factors such as climate, geography, and cultural traditions. We'll delve into the daily lives of sheep on the farm, from grazing in lush pastures to the annual shearing of their wool.</br></br>
            The Social Lives of Sheep:
            Contrary to popular belief, sheep are highly social animals with complex social structures and behaviors. They form strong bonds within their flock, communicate through various vocalizations and body language, and demonstrate remarkable intelligence in navigating their social dynamics. Understanding the social lives of sheep offers insight into their emotional well-being and the importance of flock management practices that promote positive interactions.</br></br>
            Guardians of the Land:
            Beyond their agricultural significance, sheep also play a crucial role in sustainable land management and conservation. Grazing sheep help maintain grasslands, prevent overgrowth, and promote biodiversity by creating diverse habitats for other species. Additionally, their woolly coats provide insulation for soil, reducing erosion and enhancing soil health. By acting as stewards of the land, sheep contribute to the ecological balance of their ecosystems.</br></br>
            Sheep in Culture and Tradition:
            Throughout history, sheep have been celebrated in art, literature, and folklore, symbolizing qualities such as purity, innocence, and resilience. From ancient mythologies to religious symbolism, sheep have left an indelible mark on human culture and traditions worldwide. We'll explore the cultural significance of sheep in different societies and their enduring presence in art, festivals, and rituals.</br></br>
            Conclusion:
            In conclusion, sheep are much more than just woolly creatures roaming the countryside. They embody resilience, adaptability, and interconnectedness with both humans and the environment. By understanding and appreciating the diverse roles and significance of sheep in agriculture, ecology, and culture, we gain a deeper appreciation for these remarkable animals and the vital contributions they make to our world. So, the next time you see a flock of sheep grazing in a meadow, take a moment to marvel at the wonders of the woolly world around us.`,
            vote:0,
            author:'664c9765c799fac51a4d9a68',
            isApproved:false
        })
        await detail.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})