cmake_minimum_required(VERSION 3.20)
project(student_records VERSION 1.0.0 LANGUAGES CXX)

include(CTest)
include(FetchContent)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(STUDENT_RECORDS_BUILD_TESTS "Build unit tests" ON)
option(STUDENT_RECORDS_FETCH_DEPENDENCIES "Fetch spdlog and GoogleTest when needed" ON)

if(STUDENT_RECORDS_FETCH_DEPENDENCIES)
    FetchContent_Declare(spdlog
        GIT_REPOSITORY https://github.com/gabime/spdlog.git
        GIT_TAG v1.13.0
        GIT_SHALLOW TRUE)
    FetchContent_MakeAvailable(spdlog)
else()
    find_package(spdlog REQUIRED)
endif()

add_library(student_records_lib
    src/repository/InMemoryStudentRepository.cpp
    src/service/StudentService.cpp
    src/validation/StudentValidator.cpp
    src/ui/ConsoleApplication.cpp
    src/logging/Logger.cpp)
target_include_directories(student_records_lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_link_libraries(student_records_lib PUBLIC spdlog::spdlog)
target_compile_features(student_records_lib PUBLIC cxx_std_20)
if(MSVC)
    target_compile_options(student_records_lib PRIVATE /W4)
else()
    target_compile_options(student_records_lib PRIVATE -Wall -Wextra -Wpedantic)
endif()

add_executable(student_records_app src/main.cpp)
target_link_libraries(student_records_app PRIVATE student_records_lib)

if(BUILD_TESTING AND STUDENT_RECORDS_BUILD_TESTS)
    if(STUDENT_RECORDS_FETCH_DEPENDENCIES)
        set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
        FetchContent_Declare(googletest
            GIT_REPOSITORY https://github.com/google/googletest.git
            GIT_TAG v1.14.0
            GIT_SHALLOW TRUE)
        FetchContent_MakeAvailable(googletest)
    else()
        find_package(GTest REQUIRED)
    endif()
    add_executable(student_records_tests
        tests/ValidatorTests.cpp
        tests/RepositoryTests.cpp
        tests/ServiceTests.cpp)
    target_link_libraries(student_records_tests PRIVATE student_records_lib GTest::gtest_main)
    include(GoogleTest)
    gtest_discover_tests(student_records_tests)
endif()
