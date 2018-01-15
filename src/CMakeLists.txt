cmake_minimum_required(VERSION 3.5.1)
project(currency-conversion-service)

find_library(cpprest REQUIRED)
find_library(cpp_redis REQUIRED)
find_package(Boost REQUIRED COMPONENTS system thread chrono)
find_package(Threads REQUIRED)
find_package(OpenSSL 1.0.1 REQUIRED)
        
set(CMAKE_CXX_STANDARD 11)
set(OPENSSL_VERSION "1.0.1")
set(OPENSSL_LIBS "${OPENSSL_LIBRARIES}")
set(LIBRARIES_SEARCH_PATHS ${OPENSSL_LIBS} ${Boost_LIBRARIES})

include_directories(${CMAKE_CURRENT_BINARY_DIR})
include_directories("./3rd-party/cpprest-controller/include")

add_executable(${PROJECT_NAME} ./main.cpp 
                               ./controller/RestController.cpp
                               ./3rd-party/cpprest-controller/network_utils.cpp
                               ./3rd-party/cpprest-controller/basic_controller.cpp
                               ./service/CurrencyConverter.cpp
                               ./database/CurrencyCache.cpp
                               )								

add_library(currencyconv STATIC 
                               ./controller/RestController.cpp
                               ./3rd-party/cpprest-controller/network_utils.cpp
                               ./3rd-party/cpprest-controller/basic_controller.cpp
                               ./service/CurrencyConverter.cpp
                               ./database/CurrencyCache.cpp
                               )								

target_link_libraries(${PROJECT_NAME} ${LIBRARIES_SEARCH_PATHS} cpprest cpp_redis tacopie)

INSTALL(TARGETS ${PROJECT_NAME} DESTINATION currency-conversion)

add_subdirectory(test)
