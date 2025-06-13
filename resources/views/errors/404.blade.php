<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>404 - PAGE NOT FOUND</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Tambahkan link CSS Tailwind atau custom CSS Anda di sini -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body class="relative min-h-screen flex flex-col items-center justify-center bg-tertiary text-center overflow-hidden">
    <!-- Background Gradasi Pojok -->
    <div
        class="absolute top-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-primary-100 to-transparent rounded-full blur-3xl opacity-70 z-10">
    </div>
    <div
        class="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-tr from-primary-100 to-transparent rounded-full blur-3xl opacity-70 z-10">
    </div>

    <div class="absolute w-2/3 h-2/3 bg-center bg-no-repeat bg-cover z-0"
        style="background-image: url('/images/Vector.png');">
        <!-- Logo -->
        <div class="mb-6">
            <img src="/images/Logo.png" alt="Sevenpion" class="h-12 w-36 mx-auto" />
        </div>

        <div class="space-y-6">
            <!-- Oops -->
            <h1 class="text-6xl md:text-9xl font-bold text-primary-100">
                Oops!
            </h1>

            <!-- 404 -->
            <h2 class="text-2xl md:text-4xl font-semibold text-primary-100">
                404 - PAGE NOT FOUND
            </h2>

            <!-- Deskripsi -->
            <p class="text-primary-100 text-sm md:text-md font-semibold max-w-md mx-auto">
                The page you are looking for might have been removed,
                had its name changed or is temporarily unavailable.
            </p>

            <!-- Tombol Home -->
            <a href="/projects"
                class="md:px-32 px-6 py-2 text-lg bg-primary-100 hover:bg-secondary text-white rounded-lg shadow-md transition duration-300 inline-block">
                Go To Home Page!
            </a>
        </div>
    </div>
</body>

</html>
