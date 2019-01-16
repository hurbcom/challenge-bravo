cmake_minimum_required(VERSION 3.0)

project(micro-service)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/../cmake)

find_library(CPPREST_LIB cpprest)
find_package(Boost REQUIRED COMPONENTS random system thread filesystem chrono atomic date_time regex)
find_package(OpenSSL 1.0.1 REQUIRED)

set(LIB_SUFFIX "64")
find_package(Soci REQUIRED COMPONENTS sqlite3)

set(OPENSSL_VERSION "1.0.1")

ADD_DEFINITIONS(-DBOOST_LOG_DYN_LINK)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(${PROJECT_NAME} main.cpp
        microsvc_controller.cpp
        foundation/network_utils.cpp
        foundation/basic_controller.cpp)

set(MICROSERVICE_INCLUDE_DIR "foundation/include")
set(HEADER_SEARCH_PATHS ${MICROSERVICE_INCLUDE_DIR})

include_directories(${HEADER_SEARCH_PATHS})
target_link_libraries(${PROJECT_NAME}
        ${CPPREST_LIB}
        Boost::boost
        Boost::random
        Boost::system
        Boost::thread
        Boost::filesystem
        Boost::chrono
        Boost::atomic
        Boost::date_time
        Boost::regex
        OpenSSL::SSL
        ${SOCI_LIBRARY}
        ${SOCI_sqlite3_PLUGIN})