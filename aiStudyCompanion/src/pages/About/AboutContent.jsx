import image from "../../assets/profilePic.jpg"
function AboutContent(){
    const defaultStudents = [
        {
        name: "BADER ALMUTAIRI",
        major: "Computer Science",
        img: image,
        },
        {
        name: "FAISAL ALHARBI",
        major: "Computer Science",
        img: image,
        },
        {
        name: "ALWALEED ALHARTHI",
        major: "Software Engineering",
        img: image,
        },
        {
        name: "MUATH  ALZAHRANi",
        major: "Software Engineering",
        img: image,
        },
    ];
    const description ="The AI Study Companion is a web-based platform designed to simplify student life by unifying study tools like notes, flashcards, quizzes, and progress tracking in one place. It features an intelligent AI assistant that can summarize notes, generate quizzes and flashcards, and create personalized study plans to help students focus on their weak areas. Instructors can upload materials, share quizzes, and monitor student progress, while admins manage user accounts, content, and system settings. The platform promotes collaboration through study rooms and discussion spaces, aiming to make studying more organized, efficient, and less stressful for both students and educator"
    return(
        <main className="min-h-screen w-full bg-white text-gray-900">


            {/* A) Photos block (full-width) */}
            <section aria-labelledby="photos-title" className="w-full bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <h2 id="photos-title" className="sr-only">Student Photos</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {defaultStudents.map((s, i) => ( // <-- CORRECTED: Changed 'students' to 'defaultStudents'
                                <figure key={i} className="overflow-hidden rounded-2xl shadow-sm">
                                    <img
                                        src={s.img}
                                        alt={`${s.name} portrait`}
                                        className="h-48 w-full object-cover sm:h-56 md:h-64"
                                        loading="lazy"
                                    /> 
                                    <figcaption className="sr-only">{s.name}</figcaption>
                                </figure>
                            ))}
                        </div>
                </div>
            </section>


            {/* B) Names & majors block (full-width) */}
            <section aria-labelledby="team-title" className="w-full bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <h2 id="team-title" className="text-2xl font-semibold mb-6">Team</h2>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                            {defaultStudents.map((s, i) => ( // <-- CORRECTED: Changed 'students' to 'defaultStudents'
                                <li key={i} className="rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="font-medium">{s.name}</p>
                                    <p className="text-sm text-gray-600">{s.major}</p>
                                 </li>
                             ))}
                        </ul>
                </div>
            </section>


            {/* C) Project purpose paragraph block (full-width) */}
            <section aria-labelledby="purpose-title" className="w-full bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <h2 id="purpose-title" className="text-2xl font-semibold mb-4">Purpose</h2>
                    <p className="max-w-4xl text-base leading-7 text-gray-700">{description}</p>
                </div>
            </section>
    </main>
    )
}
export default AboutContent;