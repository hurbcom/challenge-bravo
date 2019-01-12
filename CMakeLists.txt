cmake_minimum_required(VERSION 3.0)

project(micro-service)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/cmake)

find_library(CPPREST_LIB cpprest)
find_package(Boost REQUIRED COMPONENTS random system thread filesystem chrono atomic date_time regex)
find_package(OpenSSL 1.0.1 REQUIRED)

set(LIB_SUFFIX "64")
find_package(Soci REQUIRED COMPONENTS sqlite3)

set(OPENSSL_VERSION "1.0.1")


# Configure compiler options ...
if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")

    message("-- configuring clang options")
    set(CMAKE_CXX_FLAGS "-arch x86_64 -std=c++11 -stdlib=libc++ -DBOOST_LOG_DYN_LINK -Wno-deprecated-declarations")

elseif(CMAKE_CXX_COMPILER_ID MATCHES "GNU")

    message("-- configuring gcc options")

    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++14 -DBOOST_LOG_DYN_LINK")

endif()

add_executable(${PROJECT_NAME} ./source/main.cpp
                               ./source/microsvc_controller.cpp
                               ./source/foundation/network_utils.cpp
                               ./source/foundation/basic_controller.cpp source/models/currency.hpp)

set(MICROSERVICE_INCLUDE_DIR "./source/foundation/include")
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
