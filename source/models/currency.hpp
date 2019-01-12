#include <utility>

#include<string>

using namespace std;

class Currency {
public:
    string currency;
    double value;

    Currency() {};

    Currency(string cur, float val) : currency{std::move(cur)}, value{val} {}
};
